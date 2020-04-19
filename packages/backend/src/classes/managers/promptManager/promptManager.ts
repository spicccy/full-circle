import { SHUFFLE_NUM } from '../../../constants';
import { shuffle } from '../../../util/util';
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

    let shuffled = shuffle(prompts);
    for (let i = 0; i < SHUFFLE_NUM; i++) {
      shuffled = shuffle(shuffled);
    }

    return shuffled.slice(0, numPlayers).map((val) => val.prompt);
  };
}
