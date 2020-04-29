import { PromptCategory } from '@full-circle/shared/lib/roomState';

import actors from './actors.json';
import csgo from './csgo.json';
import fastfood from './fastfood.json';
import florida from './florida.json';
import generic from './generic.json';
import league from './league.json';
import pokemon from './pokemon_gen1.json';

const promptMap: Record<PromptCategory, string[]> = {
  [PromptCategory.ACTORS]: actors,
  [PromptCategory.CSGO]: csgo,
  [PromptCategory.FASTFOOD]: fastfood,
  [PromptCategory.FLORIDA]: florida,
  [PromptCategory.GENERIC]: generic,
  [PromptCategory.LEAGUE]: league,
  [PromptCategory.POKEMON]: pokemon,
};

export const loadPrompts = (category: PromptCategory): string[] => {
  const prompts = promptMap[category];
  if (!prompts) {
    throw new Error(`${category} not recognised`);
  }

  return prompts;
};
