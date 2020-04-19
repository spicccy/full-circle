import { csgo } from './csgo';
import { generic } from './generic';
import { league } from './league';

export interface IPrompt {
  id: number;
  prompt: string;
}

export type PromptList = Array<IPrompt>;

export enum Category {
  LEAGUE = 'LEAGUE',
  CSGO = 'CSGO',
  GENERIC = 'GENERIC',
}

export const getPrompts = (category: Category): PromptList => {
  switch (category) {
    case Category.LEAGUE:
      return league;
    case Category.CSGO:
      return csgo;
    case Category.GENERIC:
      return generic;
    default:
      return generic;
  }
};
