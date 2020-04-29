import { PromptCategory } from '@full-circle/shared/lib/roomState';
import { shuffle } from 'lodash';

import { loadPrompts } from '../../prompts';

export type PromptManagerOptions = {
  category?: PromptCategory;
  predictableRandomness?: boolean;
};

class PromptsGenerator {
  getPrompts = (
    category: PromptCategory,
    numPlayers: number,
    predictableRandomness = false
  ): string[] => {
    const prompts = loadPrompts(category);
    const randomisedPrompts = predictableRandomness
      ? prompts
      : shuffle(prompts);

    return randomisedPrompts.slice(0, numPlayers);
  };
}

export default new PromptsGenerator();
