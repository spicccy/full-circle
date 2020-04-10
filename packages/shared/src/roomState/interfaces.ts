import { PhaseType } from './constants';

export interface IPrompt {
  text: string;
  playerId: string;
}

export interface IImage {
  imageData: string;
  playerId: string;
}

export interface ILink {
  prompt: IPrompt;
  image: IImage;
}

export interface IChain {
  id: string;
  links: ILink[];
}

export interface IPlayer {
  id: string;
  username: string;
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

export interface IRoundData {
  id: string;
  data: string;
}

export interface IRoomStateSynced {
  curator: string;
  chains: IChain[];
  players: Record<string, IPlayer>;
  round: number;
  phase: IPhase;
  submittedPlayers: Record<string, boolean>;
  roundData: IRoundData[];
  warnings: Record<string, string>;
}

export enum Warning {
  CONFLICTING_USERNAMES = 'conflicting_usernames',
  NOT_ENOUGH_PLAYERS = 'not_enough_players',
}
