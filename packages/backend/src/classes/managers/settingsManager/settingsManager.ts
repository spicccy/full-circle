import { Category } from '@full-circle/shared/lib/prompts';

import { Allocation } from '../../../util/sortPlayers/sortPlayers';
import { PromptManager } from '../promptManager/promptManager';

export interface ISettingsManager {
  getInitialPrompts: (players: number) => string[];
  setPromptPack: (type: string | Category) => void;
}

export type IRoomConfig = {
  chainAllocationMethod?: Allocation;
  initialPromptSet?: Category;
};

export class SettingsManager implements ISettingsManager {
  _chainAllocationMethod: Allocation = Allocation.RAND;
  _promptSet: string | Category = Category.GENERIC;

  constructor(config?: IRoomConfig) {
    if (config) {
      const { chainAllocationMethod, initialPromptSet } = config;

      if (chainAllocationMethod) {
        this._chainAllocationMethod = chainAllocationMethod;
      }

      if (initialPromptSet) {
        this._promptSet = initialPromptSet;
      }
    }
  }

  getInitialPrompts = (players: number) => {
    const promptManager = new PromptManager({ category: this._promptSet });
    return promptManager.getInitialPrompts(players);
  };

  setPromptPack = (type: string | Category) => {
    this._promptSet = type;
  };
}
