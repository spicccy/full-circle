import { ArraySchema, MapSchema, Schema, type } from '@colyseus/schema';
import { ClientAction } from '@full-circle/shared/lib/actions';
import { objectValues } from '@full-circle/shared/lib/helpers';
import { IJoinOptions } from '@full-circle/shared/lib/join/interfaces';
import { PhaseType } from '@full-circle/shared/lib/roomState/constants';
import {
  IPlayer,
  IRoomStateSynced,
} from '@full-circle/shared/lib/roomState/interfaces';

import { IClient } from '../interfaces';
import { getAllocation } from '../util/sortPlayers/sortPlayers';
import DrawState from './stateMachine/drawState';
import EndState from './stateMachine/endState';
import GuessState from './stateMachine/guessState';
import LobbyState from './stateMachine/lobbyState';
import RevealState from './stateMachine/revealState';
import Chain from './subSchema/chain';
import Link from './subSchema/link';
import Phase, {
  DEFAULT_DRAW_PHASE_LENGTH,
  DEFAULT_GUESS_PHASE_LENGTH,
} from './subSchema/phase';
import Player from './subSchema/player';

/**
 * These are functions that each specific state will need to implement.
 * The behaviour of these functions changes depending on which state we are in.
 */
export interface IState {
  onReceive: (message: ClientAction) => void;
  onJoin: (client: IClient, options: IJoinOptions) => void;
  onLeave: (client: IClient, consented: boolean) => void;
  advanceState: () => void;
  onClientReady: (clientId: string) => void;
}

/**
 * How specific states should interact with the roomState.
 */
export interface IRoomStateBackend {
  setCurator: (id: string) => void;
  getCurator: () => string;

  addPlayer: (player: IPlayer) => void;
  removePlayer: (playerId: string) => void;
  readonly numPlayers: number;
  readonly gameIsOver: boolean;

  incrementRound: () => void;
  getRound: () => number;

  allocate: () => void;
  readonly currChains: ArraySchema<Chain>;

  setDrawState: (duration?: number) => void;
  setGuessState: (duration?: number) => void;
  setRevealState: () => void;
  setEndState: () => void;
  setLobbyState: () => void;

  //=====================================
  // TODO:
  // Hard-coded for the frontend to know
  // if players has submitted a drawing
  //=====================================
  addSubmittedPlayer: (id: string) => void;
}

class RoomState extends Schema
  implements IState, IRoomStateSynced, IRoomStateBackend {
  currState: IState = new LobbyState(this);

  //==================================================================================
  // IRoomStateSynced API
  // These values are automagically synced with the frontend,
  // we cannot hide them from backend if the backend accesses this class as RoomState.
  // Instead the backend should use the IRoomStateBackend interface as API.
  //==================================================================================
  @type('string')
  curator = '';

  @type([Chain])
  chains = new ArraySchema<Chain>();

  @type({ map: Player })
  players = new MapSchema<Player>();

  //=====================================
  // TODO:
  // Hard-coded for the frontend to know
  // if players has submitted a drawing
  //=====================================
  @type({ map: 'boolean' })
  submittedPlayers = new MapSchema<boolean>();

  @type('number')
  round = 10;

  @type(Phase)
  phase = new Phase(PhaseType.LOBBY);

  // =====================================
  // IRoomStateBackend Api
  // =====================================
  setCurator = (id: string): void => {
    this.curator = id;
  };

  getCurator = (): string => {
    return this.curator;
  };

  addPlayer = (player: IPlayer): void => {
    const { id } = player;
    this.players[id] = player;
  };

  removePlayer = (playerId: string) => {
    if (playerId === this.curator) {
      // TODO: handle closing the room better
      this.currState = new EndState(this);
    }
    delete this.players[playerId];
  };

  getPlayer = (id: string): IPlayer => {
    return this.players[id];
  };

  //=====================================
  // TODO:
  // Hard-coded for the frontend to know
  // if players has submitted a drawing
  //=====================================
  addSubmittedPlayer = (id: string): void => {
    this.submittedPlayers[id] = true;
  };

  get numPlayers() {
    return Object.keys(this.players).length;
  }

  incrementRound = () => {
    this.round += 1;
  };

  getRound = () => {
    return this.round;
  };

  get currChains() {
    return this.chains;
  }

  allocate = () => {
    this.chains = new ArraySchema<Chain>();
    const allocation = getAllocation(0);
    const ids = objectValues(this.players).map((val) => val.id);
    const chainOrder = allocation(ids);
    if (!chainOrder) return;
    this.setChains(chainOrder);
  };

  setChains = (chainOrder: string[][]) => {
    for (const currChain of chainOrder) {
      const owner = currChain[0];
      const newChain = new Chain(owner);
      const numLinks = currChain.length;
      newChain.addLink(new Link(owner, ''));
      for (let j = 1; j < numLinks - 1; j += 2) {
        const guesser = currChain[j];
        const drawer = currChain[j + 1];
        newChain.addLink(new Link(drawer, guesser));
      }
      this.chains.push(newChain);
    }
  };

  get gameIsOver() {
    // TODO: implement checking of the room's configured round length
    let phasesElapsed = this.round * 2;
    if (this.phase.phaseType === PhaseType.GUESS) {
      phasesElapsed += 1;
    }
    if (phasesElapsed > this.numPlayers) {
      return true;
    }

    return false;
  }

  // State-transition helpers
  setDrawState = (duration?: number) => {
    this.phase = new Phase(
      PhaseType.DRAW,
      duration ?? DEFAULT_DRAW_PHASE_LENGTH
    );
    this.currState = new DrawState(this);
  };

  setGuessState = (duration?: number) => {
    this.phase = new Phase(
      PhaseType.GUESS,
      duration ?? DEFAULT_GUESS_PHASE_LENGTH
    );
    this.currState = new GuessState(this);
  };

  setEndState = () => {
    this.phase = new Phase(PhaseType.END);
    this.currState = new EndState(this);
  };

  setRevealState = () => {
    this.phase = new Phase(PhaseType.REVEAL);
    this.currState = new RevealState(this);
  };

  setLobbyState = () => {
    this.phase = new Phase(PhaseType.LOBBY);
    this.currState = new LobbyState(this);
  };

  // ===========================================================================
  // State-specific behaviour
  // The behaviour and functionality here is to be delegated to the currentState
  // ===========================================================================
  onClientReady = (clientId: string): void => {
    this.currState.onClientReady(clientId);
  };

  onReceive = (message: ClientAction) => {
    this.currState.onReceive(message);
  };

  onJoin = (client: IClient, options: IJoinOptions) => {
    this.currState.onJoin(client, options);
  };

  onLeave = (client: IClient, consented: boolean) => {
    this.currState.onLeave(client, consented);
  };

  advanceState = () => {
    this.currState.advanceState();
  };
}

export default RoomState;
