import { Schema } from '@colyseus/schema';
import { CanvasAction } from '@full-circle/shared/lib/canvas';
import { IChain, IPlayer, LinkType } from '@full-circle/shared/lib/roomState';

import {
  Allocation,
  getAllocation,
} from '../../../util/sortPlayers/sortPlayers';
import { shuffle } from '../../../util/util';
import { RoomOptions } from '../../roomState';
import Link from '../../subSchema/link';
import { genPrompts } from '../../../util/genPrompts/genPrompts';
import { MAX_PLAYERS } from '../../../constants';
import { Category } from '../../../util/genPrompts/prompts';

interface IChainManager {
  readonly chains: IChain[];
  generateChains: (players: IPlayer[], options?: RoomOptions) => void;
  storeGuess: (id: string, guess: string, round: number) => boolean;
  storeDrawing: (id: string, drawing: CanvasAction[], round: number) => boolean;
}

class ChainManager extends Schema implements IChainManager {
  _chains: IChain[] = [];

  generateChains = (players: IPlayer[], options?: RoomOptions) => {
    const ids = players.map((val) => val.id);
    const chainOrder = getAllocation(
      options?.predictableChains ? Allocation.ORDERED : Allocation.RAND
    )(ids);

    if (!chainOrder) {
      throw new Error('Chain allocation failed!');
    }

    const prompts = genPrompts(MAX_PLAYERS, Category.GENERIC);
    this._chains = chainOrder.map((chainIds) => {
      const owner = chainIds[0];
      const links = chainIds.map(
        (playerId, j) =>
          new Link({
            type: j % 2 ? LinkType.PROMPT : LinkType.IMAGE,
            id: `${owner}-${j}`,
            playerId,
          })
      );

      const initialPrompt = prompts.pop() ?? '';
      const initialLink = new Link({
        type: LinkType.PROMPT,
        id: `${owner}-start`,
        data: initialPrompt,
        playerId: '',
      });

      return {
        owner,
        links: [initialLink, ...links],
      };
    });
  };

  storeGuess = (id: string, guess: string, round: number): boolean => {
    for (const chain of this._chains) {
      const link = chain.links[round];
      if (link.playerId === id) {
        link.data = guess;
        return true;
      }
    }
    return false;
  };

  storeDrawing = (
    id: string,
    drawing: CanvasAction[],
    round: number
  ): boolean => {
    for (const chain of this._chains) {
      const link = chain.links[round];
      if (link.playerId === id) {
        link.data = JSON.stringify(drawing);
        return true;
      }
    }
    return false;
  };

  get chains() {
    return this._chains;
  }
}

export default ChainManager;
