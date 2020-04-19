import { Category } from '../prompts';

export type RoomSettings = {
  maxRounds?: number;
  promptPack?: Category | string;
  gameMode?: 'startDraw' | 'startGuess';
  predictableRandomness?: boolean;
};
