import { Allocation } from '../../../util/sortPlayers/sortPlayers';
import { Category } from '../promptManager';
import { PromptManager } from '../promptManager/promptManager';

export interface ISettingsManager {
  getPromptManager: () => PromptManager;
}

export type IRoomConfig = {
  chainAllocationMethod?: Allocation;
  initialPromptSet?: Category;
};

export class SettingsManager implements ISettingsManager {
  _chainAllocationMethod: Allocation = Allocation.RAND;
  _initialPromptSet: Category = Category.GENERIC;

  constructor(config?: IRoomConfig) {
    if (config) {
      const { chainAllocationMethod, initialPromptSet } = config;

      if (chainAllocationMethod) {
        this._chainAllocationMethod = chainAllocationMethod;
      }

      if (initialPromptSet) {
        this._initialPromptSet = initialPromptSet;
      }
    }
  }

  getPromptManager = () => {
    return new PromptManager(this._initialPromptSet);
  };
}
