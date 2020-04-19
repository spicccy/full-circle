import { Category, getPrompts } from './prompts/index';
import { IPrompt } from './prompts/index';

export const genPrompts = (numPlayers: number, Cat: Category): string[] => {
  const prompts = getPrompts(Cat);
  const shuffle = (a: IPrompt, b: IPrompt) => 0.5 - Math.random();
  const shuffled = prompts.sort(shuffle).slice(0, numPlayers);
  return shuffled.map((val) => val.prompt);
};
