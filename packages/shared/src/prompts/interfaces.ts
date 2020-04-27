import { actors } from './actors';
import { csgo } from './csgo';
import { fastfood } from './fastfood';
import { florida } from './florida';
import { generic } from './generic';
import { league } from './league';
import { pokemon } from './pokemon';

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
  POKEMON = 'Pokemon',
  FLORIDA = 'Florida man',
}

export const PromptCategories: Category[] = [
  Category.GENERIC,
  Category.FASTFOOD,
  Category.LEAGUE,
  Category.ACTORS,
  Category.CSGO,
  Category.POKEMON,
  // Category.FLORIDA, eh will rethink this later
];

export const getPrompts = (category: Category): PromptList => {
  const map: Record<Category, PromptList> = {
    [Category.LEAGUE]: league,
    [Category.CSGO]: csgo,
    [Category.GENERIC]: generic,
    [Category.ACTORS]: actors,
    [Category.FASTFOOD]: fastfood,
    [Category.POKEMON]: pokemon,
    [Category.FLORIDA]: florida,
  };

  return map[category] ?? generic;
};
