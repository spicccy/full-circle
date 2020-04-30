import { PromptCategory } from '../roomState';

export type RoomSettings = {
  maxRounds?: number;
  promptPack: PromptCategory;
  gameMode?: 'startDraw' | 'startGuess';
  predictableRandomness?: boolean;
};
