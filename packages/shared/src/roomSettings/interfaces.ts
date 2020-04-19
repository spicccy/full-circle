import { Category } from '../prompts';

export enum RoomSettingRequestType {
  GAME_MODE, // start on DRAW or GUESS
  MAX_ROUNDS, // not really using this atm
  PROMPT_PACK, // let's choose the set
}

interface ISetGameMode {
  setting: RoomSettingRequestType.GAME_MODE;
  value: 'START_DRAW' | 'START_GUESS'; // nothing to change yet
}

interface ISetMaxRounds {
  setting: RoomSettingRequestType.MAX_ROUNDS;
  value: number; // nothing to change yet
}

interface ISetPromptPack {
  setting: RoomSettingRequestType.PROMPT_PACK;
  value: string | Category;
}

export type RoomSettingRequest = ISetGameMode | ISetPromptPack | ISetMaxRounds;
