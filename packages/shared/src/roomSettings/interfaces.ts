import { GameType, PromptCategory } from '../roomState';

export type RoomSettings = {
  maxRounds?: number;
  promptPack: PromptCategory;
  gameType: GameType;
  predictableRandomness?: boolean;
};
