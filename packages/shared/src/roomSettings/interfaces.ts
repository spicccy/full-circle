import { Category } from '../prompts';

export type RoomSettings = {
  maxRounds?: number;
  promptPack?: Category;
  gameMode?: 'startDraw' | 'startGuess';
  predictableRandomness?: boolean;
};
