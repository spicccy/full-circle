import { ArraySchema, MapSchema, Schema, type } from '@colyseus/schema';
import { ClientAction } from '@full-circle/shared/lib/actions';
import { warn } from '@full-circle/shared/lib/actions/server';
import { CanvasAction } from '@full-circle/shared/lib/canvas';
import { objectValues } from '@full-circle/shared/lib/helpers';
import { IJoinOptions } from '@full-circle/shared/lib/join/interfaces';
import { PhaseType } from '@full-circle/shared/lib/roomState/constants';
import {
  IPlayer,
  IRoomStateSynced,
  Warning,
} from '@full-circle/shared/lib/roomState/interfaces';
import invariant from 'tiny-invariant';

import { IClient, IClock } from '../interfaces';
import { MyRoom } from '../MyRoom';
import { getAllocation } from '../util/sortPlayers/sortPlayers';
import DrawState from './stateMachine/drawState';
import EndState from './stateMachine/endState';
import GuessState from './stateMachine/guessState';
import LobbyState from './stateMachine/lobbyState';
import RevealState from './stateMachine/revealState';
import Chain from './subSchema/chain';
import Link from './subSchema/link';
import Phase from './subSchema/phase';
import Player from './subSchema/player';
import RoundData from './subSchema/roundData';

/**
 * These are functions that each specific state will need to implement.
 * The behaviour of these functions changes depending on which state we are in.
 */
export interface IState {
  onReceive: (client: IClient, message: ClientAction) => void;
  onJoin: (client: IClient, options: IJoinOptions) => void;
  onLeave: (client: IClient, consented: boolean) => void;
  onClientReady: (clientId: string) => void;
  onStateStart: () => void;
  onStateEnd: () => void;
  // public for tests
  advanceState: () => void;
}

/**
 * How specific states should interact with the roomState.
 */
export interface IRoomStateBackend {
  readonly clock: IClock;
  setCurator: (id: string) => void;
  getCurator: () => string;

  addClient: (client: IClient) => void;
  removeClient: (clientId: string) => void;
  getClient: (clientId: string) => IClient;

  addPlayer: (player: IPlayer) => Warning | null;
  removePlayer: (playerId: string) => void;
  readonly numPlayers: number;
  readonly gameIsOver: boolean;

  sendWarning: (clientID: string, warning: Warning) => void;
  readonly hasConflictingUsernames: boolean;

  setPhase: (phase: Phase) => void;
  incrementRound: () => void;
  getRound: () => number;

  allocate: () => void;
  readonly currChains: ArraySchema<Chain>;

  storeGuess: (id: string, guess: string) => boolean;
  storeDrawing: (id: string, drawing: CanvasAction[]) => boolean;

  setCurrDrawings: () => void;
  setCurrPrompts: () => void;

  setDrawState: (duration?: number) => void;
  setGuessState: (duration?: number) => void;
  setRevealState: () => void;
  setEndState: () => void;
  setLobbyState: () => void;

  addSubmittedPlayer: (id: string) => void;
  clearSubmittedPlayers: () => void;
}

class RoomState extends Schema
  implements IState, IRoomStateSynced, IRoomStateBackend {
  currState: IState = new LobbyState(this);

  constructor(private room: MyRoom, public clock: IClock) {
    super();
    this.room = room;
  }

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

  @type({ map: 'boolean' })
  submittedPlayers = new MapSchema<boolean>();

  @type('number')
  round = 0;

  @type(Phase)
  phase = new Phase(PhaseType.LOBBY);

  @type([RoundData])
  roundData = new ArraySchema<RoundData>();

  @type({ map: 'string' })
  warnings = new MapSchema<string>();

  clients = new Map<string, IClient>();

  // =====================================
  // IRoomStateBackend Api
  // =====================================
  setCurator = (id: string): void => {
    this.curator = id;
  };

  getCurator = (): string => {
    return this.curator;
  };

  addClient = (client: IClient) => {
    this.clients.set(client.id, client);
  };

  removeClient = (clientId: string) => {
    this.clients.delete(clientId);
  };

  getClient = (clientId: string): IClient => {
    const maybeClient = this.clients.get(clientId);
    if (maybeClient) return maybeClient;

    // if we can't find a particular client, fallback to messaging the curator
    const maybeCurator = this.clients.get(this.curator);
    invariant(
      maybeCurator,
      "There's no players or curator clients in this room"
    );
    return maybeCurator;
  };

  addPlayer = (player: IPlayer): Warning | null => {
    for (const id in this.players) {
      const existingPlayer: Player = this.players[id];
      if (player.username === existingPlayer.username) {
        return Warning.CONFLICTING_USERNAMES;
      }
    }

    const { id } = player;
    this.players[id] = player;
    return null;
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

  addSubmittedPlayer = (id: string): void => {
    this.submittedPlayers[id] = true;
  };

  clearSubmittedPlayers = (): void => {
    for (const playerId in this.submittedPlayers) {
      this.submittedPlayers[playerId] = false;
    }
  };

  get numPlayers() {
    return Object.keys(this.players).length;
  }

  get hasConflictingUsernames() {
    const usedNames: string[] = [];
    for (const playerId in this.players) {
      const player: Player = this.players[playerId];
      if (usedNames.includes(player.username)) {
        return true;
      }
      usedNames.push(player.username);
    }
    return false;
  }

  sendWarning = (clientId: string, warning: Warning) => {
    const client = this.getClient(clientId);
    this.room.send(client, warn(warning));
  };

  incrementRound = () => {
    this.round += 1;
  };

  getRound = () => {
    return this.round;
  };

  setPhase = (phase: Phase) => {
    this.phase = phase;
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

  storeGuess = (id: string, guess: string): boolean => {
    const round = this.round;
    const chains = this.chains;
    for (const chain of chains) {
      const prompt = chain.getLinks[round].prompt;
      if (prompt.playerId === id) {
        prompt.setText(guess);
        return true;
      }
    }
    return false;
  };

  storeDrawing = (id: string, drawing: CanvasAction[]): boolean => {
    const round = this.round;
    const chains = this.chains;
    for (const chain of chains) {
      const image = chain.getLinks[round - 1].image;
      if (image.playerId === id) {
        image.setImage(JSON.stringify(drawing));
        return true;
      }
    }
    return false;
  };

  setCurrPrompts = () => {
    this.roundData = new ArraySchema<RoundData>();
    const round = this.round - 1;
    const chains = this.chains;
    for (const chain of chains) {
      const data = chain.getLinks[round].prompt.text;
      const id = chain.getLinks[round].image.playerId;
      this.roundData.push(new RoundData(id, data));
    }
  };

  setCurrDrawings = () => {
    this.roundData = new ArraySchema<RoundData>();
    const round = this.round - 1;
    const chains = this.chains;
    for (const chain of chains) {
      const data = chain.getLinks[round].image.imageData;
      const id = chain.getLinks[round + 1].prompt.playerId;
      this.roundData.push(new RoundData(id, data));
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
  setDrawState = () => {
    this.onStateEnd();
    this.currState = new DrawState(this);
    this.onStateStart();
  };

  setGuessState = () => {
    this.onStateEnd();
    this.currState = new GuessState(this);
    this.onStateStart();
  };

  setEndState = () => {
    this.onStateEnd();
    this.currState = new EndState(this);
    this.onStateStart();
  };

  setRevealState = () => {
    this.onStateEnd();
    this.currState = new RevealState(this);
    this.onStateStart();
  };

  setLobbyState = () => {
    this.onStateEnd();
    this.currState = new LobbyState(this);
    this.onStateStart();
  };

  // ===========================================================================
  // State-specific behaviour
  // The behaviour and functionality here is to be delegated to the currentState
  // ===========================================================================
  onClientReady = (clientId: string): void => {
    this.currState.onClientReady(clientId);
  };

  onReceive = (client: IClient, message: ClientAction) => {
    this.currState.onReceive(client, message);
  };

  onJoin = (client: IClient, options: IJoinOptions) => {
    this.clients.set(client.id, client);
    this.currState.onJoin(client, options);
  };

  onLeave = (client: IClient, consented: boolean) => {
    this.currState.onLeave(client, consented);
  };

  onStateStart = () => {
    this.currState.onStateStart();
  };

  onStateEnd = () => {
    this.currState.onStateEnd();
  };

  advanceState = () => {
    this.currState.advanceState();
  };
}

export default RoomState;
