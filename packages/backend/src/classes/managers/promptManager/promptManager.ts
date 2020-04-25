import { Category, getPrompts } from '@full-circle/shared/lib/prompts';
import { shuffle } from 'lodash';

export type PromptManagerOptions = {
  category?: Category;
  testing?: boolean;
};

export class PromptManager {
  _category: Category = Category.GENERIC;
  _testing = false;

  constructor(options?: PromptManagerOptions) {
    if (options) {
      const { category, testing } = options;
      if (category) {
        this._category = category;
      }
      if (testing) {
        this._testing = testing;
        this._category = Category.GENERIC;
      }
    }
  }

  getInitialPrompts = (numPlayers: number): string[] => {
    const prompts = getPrompts(this._category);

    if (this._testing) {
      return prompts.slice(0, numPlayers).map((val) => val.prompt);
    }
    const shuffled = shuffle(prompts);
    return shuffled.slice(0, numPlayers).map((val) => val.prompt);
  };
}
