import { Schema, type } from '@colyseus/schema';
import { CanvasAction } from '@full-circle/shared/lib/canvas';
import { RoomSettings } from '@full-circle/shared/lib/roomSettings';
import {
  IChain,
  IChainManagerData,
  IPlayer,
  LinkType,
} from '@full-circle/shared/lib/roomState';

import {
  Allocation,
  getAllocation,
} from '../../../util/sortPlayers/sortPlayers';
import { Chain } from '../../subSchema/chain';
import Link from '../../subSchema/link';

export interface IChainManager {
  readonly chains: IChain[];
  generateChains: (
    players: IPlayer[],
    initialPrompts: string[],
    options?: RoomSettings
  ) => void;
  storeGuess: (id: string, guess: string, round: number) => boolean;
  storeDrawing: (id: string, drawing: CanvasAction[], round: number) => boolean;
  revealNext: () => boolean;
}

class ChainManager extends Schema implements IChainManager, IChainManagerData {
  private _chains: Chain[] = [];
  private currRevealIndex = 0;

  @type(Chain)
  revealedChain: Chain | null = null;

  generateChains = (
    players: IPlayer[],
    initialPrompts: string[],
    options?: RoomSettings
  ) => {
    const ids = players.map((val) => val.id);
    const chainOrder = getAllocation(
      options?.predictableRandomness ? Allocation.ORDERED : Allocation.RAND
    )(ids);

    if (!chainOrder) {
      throw new Error('Chain allocation failed!');
    }

    this._chains = chainOrder.map((chainIds) => {
      const owner = chainIds[0];
      const links = chainIds.map(
        (playerId, j) =>
          new Link({
            type: j % 2 ? LinkType.PROMPT : LinkType.IMAGE,
            id: `${owner}-${j}`,
            playerId,
            data: null,
          })
      );

      const initialPrompt = initialPrompts.pop() ?? '';
      const initialLink = new Link({
        type: LinkType.PROMPT,
        id: `${owner}-start`,
        data: initialPrompt,
        playerId: '',
      });

      return new Chain(owner, [initialLink, ...links]);
    });
  };

  revealNext = () => {
    if (this.currRevealIndex < this.chains.length) {
      this.revealedChain = this.chains[this.currRevealIndex];
      this.currRevealIndex++;
      return true;
    }
    return false;
  };

  storeGuess = (id: string, guess: string, round: number): boolean => {
    for (const chain of this._chains) {
      const link = chain.links[round];
      if (link.type === LinkType.PROMPT && link.playerId === id) {
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
      if (link.type === LinkType.IMAGE && link.playerId === id) {
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
