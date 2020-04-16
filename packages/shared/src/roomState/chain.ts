export interface IPrompt {
  type: 'prompt';
  id: string;
  data?: string;
  playerId: string;
}

export interface IImage {
  type: 'image';
  id: string;
  data?: string;
  playerId: string;
}

export type ILink = IPrompt | IImage;

export interface IChain {
  owner: string;
  links: ILink[];
}
