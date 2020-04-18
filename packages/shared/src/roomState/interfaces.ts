import { PhaseType } from './constants';

export interface IPlayer {
  id: string;
  username: string;
  disconnected: boolean;
  score: number;
}

export interface IPhase {
  // When did this phase start? UNIX time
  phaseStart: number;

  // When does the phase end?
  phaseEnd?: number;
  phaseType: PhaseType;
}

export interface IRoomMetadata {
  // 4-letter room code
  roomCode: string;
}

export interface IRoomStateSynced {
  curator: string;
  players: Record<string, IPlayer>;
  round: number;
  phase: IPhase;
  submittedPlayers: Record<string, boolean>;
  revealer: string;
}

export enum RoomErrorType {
  TOO_MANY_PLAYERS = 'The room is already full',
  GAME_ALREADY_STARTED = 'The game has already started',
  CONFLICTING_USERNAMES = 'That username has already been taken for this room',
  NOT_ENOUGH_PLAYERS = 'You need at least three players to join this room',
  ROOM_NOT_FOUND = 'No room with a matching code was found',
  ROOM_INITIALISATION_ERROR = 'Unable to initialise the room',
  NETWORK_ERROR = 'Network error',
  RECONNECT_ERROR = 'Failed to reconnect',
  UNKNOWN_ERROR = 'An unknown error occured',
}
