import { SHUFFLE_NUM } from '../../constants';
import { shuffle } from './../util';
import { Category, getPrompts, IPrompt } from './prompts/index';

export const genPrompts = (numPlayers: number, Cat: Category): string[] => {
  const prompts = getPrompts(Cat);
  let shuffled = shuffle<IPrompt>(prompts);
  for (let i = 0; i < SHUFFLE_NUM; i++) {
    shuffled = shuffle<IPrompt>(shuffled);
  }

  const sliced = shuffled.slice(0, numPlayers);
  return sliced.map((val) => val.prompt);
};
