import { shuffle } from 'lodash';

import { Category, getPrompts } from '.';

export class PromptManager {
  _category: Category;
  _testing = false;

  constructor(category: Category, testing?: boolean) {
    this._category = category;
    if (testing) {
      this._testing = testing;
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
