import { ArraySchema, MapSchema, Schema, type } from '@colyseus/schema';
import { ClientAction, ServerAction } from '@full-circle/shared/lib/actions';
import {
  curatorReveal,
  displayDrawing,
  displayPrompt,
  warn,
} from '@full-circle/shared/lib/actions/server';
import { CanvasAction } from '@full-circle/shared/lib/canvas';
import { objectValues } from '@full-circle/shared/lib/helpers';
import { IJoinOptions } from '@full-circle/shared/lib/join/interfaces';
import { PhaseType } from '@full-circle/shared/lib/roomState/constants';
import {
  IPlayer,
  IRoomStateSynced,
  RoomErrorType,
  IChain,
} from '@full-circle/shared/lib/roomState/interfaces';
import { Client } from 'colyseus';

import { MAX_PLAYERS } from '../constants';
import { IClient, IClock, IRoom } from '../interfaces';
import { Allocation, getAllocation } from '../util/sortPlayers/sortPlayers';
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

  addPlayer: (player: IPlayer) => RoomErrorType | null;
  removePlayer: (playerId: string) => void;
  readonly numPlayers: number;
  readonly gameIsOver: boolean;

  sendAction: (clientID: string, action: ServerAction) => void;
  sendWarning: (clientID: string, warning: RoomErrorType) => void;
  sendReveal: () => void;

  setRevealer: () => void;

  setPhase: (phase: Phase) => void;
  incrementRound: () => void;
  getRound: () => number;

  allocate: () => void;
  readonly currChains: ArraySchema<Chain>;

  storeGuess: (id: string, guess: string) => boolean;
  storeDrawing: (id: string, drawing: CanvasAction[]) => boolean;

  sendCurrDrawings: () => void;
  sendCurrPrompts: () => void;

  setDrawState: (duration?: number) => void;
  setGuessState: (duration?: number) => void;
  setRevealState: () => void;
  setEndState: () => void;
  setLobbyState: () => void;

  readonly allPlayersSubmitted: boolean;
  readonly unsubmittedPlayerIds: string[];
  addSubmittedPlayer: (id: string) => void;
  clearSubmittedPlayers: () => void;
  playerDisconnected: (id: string) => void;
  playerReconnected: (id: string) => void;
  attemptReconnection: (id: string) => string | null;

  updatePlayerScores: () => void;
}

export type RoomOptions = {
  predictableChains: boolean;
};

class RoomState extends Schema
  implements IState, IRoomStateSynced, IRoomStateBackend {
  currState: IState = new LobbyState(this);
  clock: IClock;
  options?: RoomOptions;

  constructor(private room: IRoom, options?: RoomOptions) {
    super();
    this.clock = room.clock;
    this.options = options;
  }

  //==================================================================================
  // IRoomStateSynced API
  // These values are automagically synced with the frontend,
  // we cannot hide them from backend if the backend accesses this class as RoomState.
  // Instead the backend should use the IRoomStateBackend interface as API.
  //==================================================================================
  @type('string')
  curator = '';

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

  @type('string')
  revealer = '';

  displayChain = 0;

  chains = new ArraySchema<Chain>();

  // =====================================
  // IRoomStateBackend Api
  // =====================================

  // =====================================
  // Player tracking and management
  // =====================================
  setCurator = (id: string): void => {
    this.curator = id;
  };

  getCurator = (): string => {
    return this.curator;
  };

  getClient = (clientId: string): Client | undefined => {
    return this.room.clients.find((client) => client.id === clientId);
  };

  addPlayer = (player: IPlayer): RoomErrorType | null => {
    if (this.numPlayers >= MAX_PLAYERS) {
      return RoomErrorType.TOO_MANY_PLAYERS;
    }

    for (const id in this.players) {
      const existingPlayer: Player = this.players[id];
      if (player.username === existingPlayer.username) {
        return RoomErrorType.CONFLICTING_USERNAMES;
      }
    }

    const { id } = player;
    this.players[id] = player;
    this.submittedPlayers[id] = false;
    return null;
  };

  removePlayer = (playerId: string) => {
    if (playerId === this.curator) {
      // TODO: handle closing the room better
      this.currState = new EndState(this);
    }
    delete this.players[playerId];
    delete this.submittedPlayers[playerId];
  };

  getPlayer = (id: string): IPlayer => {
    return this.players[id];
  };

  get numPlayers() {
    return Object.keys(this.players).length;
  }

  get allPlayersSubmitted(): boolean {
    return objectValues(this.submittedPlayers).every(Boolean);
  }

  get unsubmittedPlayerIds(): string[] {
    const ids = [];
    for (const playerId in this.submittedPlayers) {
      if (!this.submittedPlayers[playerId]) {
        ids.push(playerId);
      }
    }

    return ids;
  }

  addSubmittedPlayer = (id: string): void => {
    this.submittedPlayers[id] = true;
  };

  clearSubmittedPlayers = (): void => {
    for (const playerId in this.submittedPlayers) {
      this.submittedPlayers[playerId] = false;
    }
  };

  playerDisconnected = (id: string): void => {
    const player: Player = this.players[id];
    player.disconnected = true;
  };

  playerReconnected = (id: string): void => {
    const player: Player = this.players[id];
    player.disconnected = false;
  };

  attemptReconnection = (username: string): string | null => {
    for (const id in this.players) {
      const player: Player = this.players[id];
      if (player.username === username && player.disconnected) {
        return player.id;
      }
    }

    return null;
  };

  // Communication with frontend
  sendAction = (clientId: string, action: ServerAction) => {
    const client = this.getClient(clientId);
    if (client) {
      this.room.send(client, action);
      console.log('sent action to ', clientId);
    }
  };

  sendWarning = (clientId: string, warning: RoomErrorType) => {
    this.sendAction(clientId, warn(warning));
  };

  setRevealer = () => {
    const itr = this.displayChain;
    const chains = this.chains;
    if (itr < chains.length) {
      this.revealer = chains[itr].id;
      return;
    }
    this.revealer = '';
  };

  sendReveal = () => {
    const curator = this.curator;
    const itr = this.displayChain++;
    if (itr < this.chains.length) {
      const chain = this.chains[itr];
      const links = chain.links;
      const payload: IChain = {
        id: chain.id,
        links: links.map((val) => {
          return val.link;
        }),
      };
      this.sendAction(curator, curatorReveal(payload));
    }
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

  // ===========================================================================
  // Chain management
  // TODO: refactor chain management into its own class (SRP)
  // ===========================================================================
  get currChains() {
    return this.chains;
  }

  allocate = () => {
    this.chains = new ArraySchema<Chain>();
    const allocation = getAllocation(
      this.options?.predictableChains ? Allocation.ORDERED : Allocation.RAND
    );
    const ids = objectValues(this.players).map((val) => val.id);
    const chainOrder = allocation(ids);
    if (!chainOrder) return;
    this.setChains(chainOrder);
  };

  setChains = (chainOrder: string[][]) => {
    const somePrompts = [
      'cat',
      'dog',
      'mouse',
      'turd',
      'chicken',
      'computer',
      'p90x',
      'car',
      'screaming rock',
      'a rockin wave',
    ];
    let i = 0;
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
      newChain.links[0].prompt.setText(somePrompts[i++]);
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

  sendCurrPrompts = () => {
    this.roundData = new ArraySchema<RoundData>();
    const round = this.round - 1;
    const chains = this.chains;
    for (const chain of chains) {
      const data = chain.getLinks[round].prompt.text;
      const id = chain.getLinks[round].image.playerId;
      this.roundData.push(new RoundData(id, data)); // TODO: get rid of, kept for debugging
      this.sendAction(id, displayPrompt(data));
    }
  };

  sendCurrDrawings = () => {
    this.roundData = new ArraySchema<RoundData>();
    const round = this.round - 1;
    const chains = this.chains;
    for (const chain of chains) {
      const data = chain.getLinks[round].image.imageData;
      const id = chain.getLinks[round + 1].prompt.playerId;
      this.roundData.push(new RoundData(id, data)); // TODO: get rid of, kept for debugging
      this.sendAction(id, displayDrawing(data));
    }
  };

  updatePlayerScores = () => {
    // reset scores so this function is idempotent
    for (const id in this.players) {
      (this.players[id] as Player).score = 0;
    }

    for (const chain of this.chains) {
      for (let i = 1; i < chain.links.length; i++) {
        if (chain.links[i].prompt.text === chain.links[i - 1].prompt.text) {
          const playerId = chain.links[i].prompt.playerId;
          (this.players[playerId] as Player).score++;
        }
      }
    }
  };

  // ===========================================================================
  // Game state management
  // ===========================================================================
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
