import { LinkType, PhaseType, StickyNoteColour, VoteType } from './constants';

export interface ILink {
  type: LinkType;
  id: string;
  data: string | null;
  playerId: string;
}

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
  roundData: ILink | null;
}

export interface IPhase {
  // When did this phase start? UNIX time
  phaseStart: number;

  // When does the phase end?
  phaseEnd: number;
  phaseType: PhaseType;
}

export interface IRoomMetadata {
  // 4-letter room code
  roomCode: string;
}

export interface IPlayerManagerData {
  playerMap: Record<string, IPlayer>;
}

export interface IVote {
  playerVotes: Record<string, VoteType>;
}

export interface IRoomStateSynced {
  curator: string;
  curatorDisconnected: boolean;
  round: number;
  showBuffer: boolean;
  phase: IPhase;
  chainManager: IChainManagerData;
  playerManager: IPlayerManagerData;
  votes: Record<string, IVote>;
}

export interface IChainManagerData {
  revealedChain: IChain | null;
}
