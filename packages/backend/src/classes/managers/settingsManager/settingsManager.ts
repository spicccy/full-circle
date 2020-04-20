import { Category } from '@full-circle/shared/lib/prompts';

import { Allocation } from '../../../util/sortPlayers/sortPlayers';

//export interface ISettingsManager {}

export type IRoomConfig = {
  chainAllocationMethod?: Allocation;
  initialPromptSet?: Category;
};

// this may not be needed. will delete if that's the case but leave around for now
// Not being used
export class SettingsManagerDEPRECATED {
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
}
