import { MapSchema, Schema, type } from '@colyseus/schema';
import { ClientAction, ServerAction } from '@full-circle/shared/lib/actions';
import {
  becomeCurator,
  curatorReveal,
  warn,
} from '@full-circle/shared/lib/actions/server';
import { CanvasAction } from '@full-circle/shared/lib/canvas';
import { objectValues } from '@full-circle/shared/lib/helpers';
import { IJoinOptions } from '@full-circle/shared/lib/join/interfaces';
import { RoomSettings } from '@full-circle/shared/lib/roomSettings';
import {
  IPlayer,
  IRoomStateSynced,
  PhaseType,
  RoomErrorType,
} from '@full-circle/shared/lib/roomState';
import { Client } from 'colyseus';

import { CURATOR_USERNAME } from '../constants';
import { IClient, IClock, IRoom } from '../interfaces';
import ChainManager from './managers/chainManager/chainManager';
import PlayerManager from './managers/playerManager/playerManager';
import { StickyNoteColourManager } from './managers/stickyNoteColourManager';
import DrawState from './stateMachine/drawState';
import EndState from './stateMachine/endState';
import GuessState from './stateMachine/guessState';
import LobbyState from './stateMachine/lobbyState';
import RevealState from './stateMachine/revealState';
import Phase from './subSchema/phase';
import Player from './subSchema/player';

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

  addPlayer: (player: Player) => RoomErrorType | null;
  removePlayer: (playerId: string) => void;
  readonly numPlayers: number;
  readonly gameIsOver: boolean;
  readonly settings: RoomSettings;

  sendAction: (clientID: string, action: ServerAction) => void;
  sendWarning: (clientID: string, warning: RoomErrorType) => void;
  revealNext: () => boolean;

  setShowBuffer: (buffering: boolean) => void;
  setPhase: (phase: Phase) => void;
  incrementRound: () => void;
  getRound: () => number;

  generateChains: (prompts: string[]) => void;
  storeGuess: (id: string, guess: string) => boolean;
  storeDrawing: (id: string, drawing: CanvasAction[]) => boolean;
  updateRoundData: () => void;

  setDrawState: (duration?: number) => void;
  setGuessState: (duration?: number) => void;
  setRevealState: () => void;
  setEndState: () => void;
  setLobbyState: () => void;

  readonly allPlayersSubmitted: boolean;
  addSubmittedPlayer: (id: string) => void;
  clearSubmittedPlayers: () => void;
  setPlayerDisconnected: (id: string) => void;
  setPlayerReconnected: (id: string) => void;
  attemptReconnection: (username: string) => void;
  curatorDisconnected: () => void;
  curatorRejoined: () => void;

  updatePlayerScores: () => void;
}

class RoomState extends Schema
  implements IState, IRoomStateSynced, IRoomStateBackend {
  currState: IState = new LobbyState(this);
  clock: IClock;
  private _settings: RoomSettings;
  private waitingCuratorRejoin = false;
  stickyNoteColourManager = new StickyNoteColourManager();

  constructor(private room: IRoom, options?: RoomSettings) {
    super();
    this.clock = room.clock;
    this._settings = options ?? {};
    this.chainManager = new ChainManager();
  }

  //==================================================================================
  // IRoomStateSynced API
  // These values are automagically synced with the frontend,
  // we cannot hide them from backend if the backend accesses this class as RoomState.
  // Instead the backend should use the IRoomStateBackend interface as API.
  //==================================================================================
  @type('string')
  curator = '';

  @type('number')
  round = 0;

  @type(Phase)
  phase = new Phase(PhaseType.LOBBY);

  @type('string')
  revealer = '';

  @type('boolean')
  showBuffer = false;

  @type(PlayerManager)
  playerManager = new PlayerManager();

  @type(ChainManager)
  chainManager = new ChainManager();

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

  curatorDisconnected = () => {
    this.waitingCuratorRejoin = true;
  };

  curatorRejoined = () => {
    this.waitingCuratorRejoin = false;
  };

  addPlayer = (player: IPlayer): RoomErrorType | null => {
    return this.playerManager.addPlayer(player);
  };

  removePlayer = (playerId: string) => {
    this.playerManager.removePlayer(playerId);
  };

  getPlayer = (id: string): IPlayer | undefined => {
    return this.playerManager.getPlayer(id);
  };

  get players() {
    return this.playerManager.players;
  }

  get numPlayers() {
    return this.playerManager.numPlayers;
  }

  get allPlayersSubmitted(): boolean {
    return this.playerManager.allPlayersSubmitted;
  }

  addSubmittedPlayer = (id: string): void => {
    this.playerManager.addSubmittedPlayer(id);
  };

  clearSubmittedPlayers = (): void => {
    this.playerManager.clearSubmittedPlayers();
  };

  setPlayerDisconnected = (id: string): void => {
    this.playerManager.setPlayerDisconnected(id);
  };

  setPlayerReconnected = (id: string): void => {
    this.playerManager.setPlayerReconnected(id);
  };

  attemptReconnection = (username: string) => {
    this.playerManager.attemptReconnection(username);
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

  revealNext = () => {
    return this.chainManager.revealNext();
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

  get settings() {
    return this._settings;
  }

  setShowBuffer = (show: boolean) => {
    this.showBuffer = show;
  };

  // ===========================================================================
  // Chain management
  // ===========================================================================
  generateChains = (initialPrompts: string[]) => {
    this.chainManager.generateChains(
      objectValues(this.players),
      initialPrompts,
      this._settings
    );
  };

  storeGuess = (id: string, guess: string): boolean => {
    return this.chainManager.storeGuess(id, guess, this.round);
  };

  storeDrawing = (id: string, drawing: CanvasAction[]): boolean => {
    return this.chainManager.storeDrawing(id, drawing, this.round);
  };

  get chains() {
    return this.chainManager.chains;
  }

  updateRoundData = () => {
    this.playerManager.updateRoundData(this.chains, this.round);
  };

  updatePlayerScores = () => {
    this.playerManager.updatePlayerScores(this.chains);
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
    if (options.username === CURATOR_USERNAME && this.waitingCuratorRejoin) {
      this.setCurator(client.id);
      this.curatorRejoined();
      this.sendAction(client.id, becomeCurator());
    } else {
      this.currState.onJoin(client, options);
    }
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
