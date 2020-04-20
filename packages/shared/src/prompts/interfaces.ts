import { actors } from './actors';
import { csgo } from './csgo';
import { fastfood } from './fastfood';
import { generic } from './generic';
import { league } from './league';

export interface IPrompt {
  id: number;
  prompt: string;
}

export type PromptList = Array<IPrompt>;

export enum Category {
  LEAGUE = 'League of Legends',
  CSGO = 'CS:GO',
  GENERIC = 'Items',
  ACTORS = 'Actors',
  FASTFOOD = 'Fast-Food',
}

export const PromptCategories: string[] = [
  Category.GENERIC,
  Category.FASTFOOD,
  Category.LEAGUE,
  Category.ACTORS,
  Category.CSGO,
];

export const getPrompts = (category: Category | string): PromptList => {
  switch (category) {
    case Category.LEAGUE:
      return league;
    case Category.CSGO:
      return csgo;
    case Category.GENERIC:
      return generic;
    case Category.ACTORS:
      return actors;
    case Category.FASTFOOD:
      return fastfood;
    default:
      return generic;
  }
};
