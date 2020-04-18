import { MapSchema, Schema, type } from '@colyseus/schema';
import {
  ClientAction,
  RoomError,
  ServerAction,
} from '@full-circle/shared/lib/actions';
import {
  curatorReveal,
  reconnect,
  warn,
} from '@full-circle/shared/lib/actions/server';
import { CanvasAction } from '@full-circle/shared/lib/canvas';
import { objectValues } from '@full-circle/shared/lib/helpers';
import { IJoinOptions } from '@full-circle/shared/lib/join/interfaces';
import {
  IChain,
  IPlayer,
  IRoomStateSynced,
  LinkType,
  PhaseType,
  RoomErrorType,
} from '@full-circle/shared/lib/roomState';
import { Client } from 'colyseus';

import { MAX_PLAYERS } from '../constants';
import { IClient, IClock, IRoom } from '../interfaces';
import { Allocation, getAllocation } from '../util/sortPlayers/sortPlayers';
import { closeEnough, shuffle } from '../util/util';
import DrawState from './stateMachine/drawState';
import EndState from './stateMachine/endState';
import GuessState from './stateMachine/guessState';
import LobbyState from './stateMachine/lobbyState';
import RevealState from './stateMachine/revealState';
import Link from './subSchema/link';
import Phase from './subSchema/phase';
import Player from './subSchema/player';

const initialPrompts = [
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

/**
 * These are functions that each specific state will need to implement.
 * The behaviour of these functions changes depending on which state we are in.
 */
export interface IState {
  onReceive: (client: IClient, message: ClientAction) => void;
  onJoin: (client: IClient, options: IJoinOptions) => void;
  onLeave: (client: IClient, consented: boolean) => boolean;
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
  sendReveal: () => boolean;
  throwJoinRoomError: (action: RoomError) => never;

  setPhase: (phase: Phase) => void;
  incrementRound: () => void;
  getRound: () => number;

  generateChains: () => void;
  storeGuess: (id: string, guess: string) => boolean;
  storeDrawing: (id: string, drawing: CanvasAction[]) => boolean;
  updateRoundData: () => void;

  setDrawState: (duration?: number) => void;
  setGuessState: (duration?: number) => void;
  setRevealState: () => void;
  setEndState: () => void;
  setLobbyState: () => void;

  readonly allPlayersSubmitted: boolean;
  readonly unsubmittedPlayerIds: string[];
  addSubmittedPlayer: (id: string) => void;
  clearSubmittedPlayers: () => void;
  setPlayerDisconnected: (id: string) => void;
  setPlayerReconnected: (id: string) => void;
  attemptReconnection: (username: string) => void;

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

  @type({ map: 'string' })
  warnings = new MapSchema<string>();

  @type('string')
  revealer = '';

  displayChain = 0;

  chains: IChain[] = [];

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

  getPlayer = (id: string): IPlayer | undefined => {
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

  setPlayerDisconnected = (id: string): void => {
    const player: Player = this.players[id];
    player.disconnected = true;
  };

  setPlayerReconnected = (id: string): void => {
    const player: Player = this.players[id];
    player.disconnected = false;
  };

  attemptReconnection = (username: string) => {
    for (const id in this.players) {
      const player: Player = this.players[id];
      if (player.username === username && player.disconnected) {
        this.throwJoinRoomError(reconnect(player.id));
      }
    }
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

  throwJoinRoomError = (action: RoomError) => {
    throw new Error(JSON.stringify(action));
  };

  sendReveal = () => {
    if (this.displayChain < this.chains.length) {
      const chain = this.chains[this.displayChain];
      this.revealer = chain.owner;
      this.sendAction(this.curator, curatorReveal(chain));
      this.displayChain++;
      return true;
    }

    return false;
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
  generateChains = () => {
    const ids = objectValues(this.players).map((val) => val.id);
    const chainOrder = getAllocation(
      this.options?.predictableChains ? Allocation.ORDERED : Allocation.RAND
    )(ids);

    if (!chainOrder) {
      throw new Error('Chain allocation failed!');
    }

    const prompts = shuffle(initialPrompts);
    this.chains = chainOrder.map((chainIds) => {
      const owner = chainIds[0];
      const links = chainIds.map(
        (playerId, j) =>
          new Link({
            type: j % 2 ? LinkType.PROMPT : LinkType.IMAGE,
            id: `${owner}-${j}`,
            playerId,
          })
      );

      const initialPrompt = prompts.pop() ?? '';
      const initialLink = new Link({
        type: LinkType.PROMPT,
        id: `${owner}-start`,
        data: initialPrompt,
        playerId: '',
      });

      return {
        owner,
        links: [initialLink, ...links],
      };
    });
  };

  storeGuess = (id: string, guess: string): boolean => {
    for (const chain of this.chains) {
      const link = chain.links[this.round];
      if (link.playerId === id) {
        link.data = guess;
        return true;
      }
    }
    return false;
  };

  storeDrawing = (id: string, drawing: CanvasAction[]): boolean => {
    for (const chain of this.chains) {
      const link = chain.links[this.round];
      if (link.playerId === id) {
        link.data = JSON.stringify(drawing);
        return true;
      }
    }
    return false;
  };

  updateRoundData = () => {
    for (const playerId in this.players) {
      const player = this.getPlayer(playerId);
      if (player) {
        player.roundData = undefined;
      }
    }

    for (const chain of this.chains) {
      const previousLink = chain.links[this.round - 1];
      const link = chain.links[this.round];
      const player = this.getPlayer(link.playerId);
      if (player) {
        player.roundData = previousLink;
      }
    }
  };

  updatePlayerScores = () => {
    // reset scores so this function is idempotent
    for (const id in this.players) {
      this.players[id].score = 0;
    }

    for (const chain of this.chains) {
      for (let i = 2; i < chain.links.length; i++) {
        if (
          chain.links[i].type === 'prompt' &&
          closeEnough(chain.links[i].data, chain.links[i - 2].data)
        ) {
          const goodDrawer = chain.links[i - 1].playerId;
          const correctGuesser = chain.links[i].playerId;
          this.players[correctGuesser].score++;
          this.players[goodDrawer].score++;
        }
      }
    }
  };

  // ===========================================================================
  // Game state management
  // ===========================================================================
  get gameIsOver() {
    return this.round === this.numPlayers;
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
    return this.currState.onLeave(client, consented);
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
