import { LinkType, PhaseType } from './constants';

export type ILink = {
  type: LinkType;
  id: string;
  data?: string;
  playerId: string;
};

export interface IChain {
  owner: string;
  links: ILink[];
}

export interface IPlayer {
  id: string;
  username: string;
  disconnected: boolean;
  score: number;
  roundData?: ILink;
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
