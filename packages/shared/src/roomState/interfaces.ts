import { PhaseType } from './constants';

export interface IPrompt {
  id: string;
  text: string;
  playerId: string;
}

export interface IImage {
  id: string;
  imageData: string;
  playerId: string;
}

export interface ILink {
  id: string;
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
  timestamp: number;
  phaseType: PhaseType;
}

export interface IRoomState {
  curator: string;
  chains: IChain[];
  player: Record<string, IPlayer>;
  round: number;
  phase: IPhase;
}