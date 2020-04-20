import { LinkType, PhaseType, StickyNoteColour } from './constants';

export type ILink = {
  type: LinkType;
  id: string;
  data: string | null;
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
  submitted: boolean;
  score: number;
  votes: number;
  stickyNoteColour: StickyNoteColour;
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

export interface IPlayerManagerData {
  playerMap: Record<string, IPlayer>;
}

export interface IRoomStateSynced {
  curator: string;
  round: number;
  showBuffer: boolean;
  phase: IPhase;
  chainManager: IChainManagerData;
  playerManager: IPlayerManagerData;
}

export interface IChainManagerData {
  revealedChain: IChain | null;
}
