import { MapSchema, Schema, type } from '@colyseus/schema';
import { objectValues } from '@full-circle/shared/lib/helpers';
import {
  IChain,
  IPlayerManagerData,
  LinkType,
  ServerError,
} from '@full-circle/shared/lib/roomState';

import { MAX_PLAYERS } from '../../../constants';
import { closeEnough } from '../../../util/util';
import Link from '../../subSchema/link';
import Player from '../../subSchema/player';
import { StickyNoteColourManager } from '../stickyNoteColourManager';

interface IPlayerManager {
  readonly players: MapSchema<Player>;
  readonly playerArray: Player[];
  readonly numPlayers: number;
  readonly allPlayersSubmitted: boolean;
  addPlayer: (clientId: string, username: string) => ServerError | null;
  removePlayer: (clientId: string) => void;
  getPlayer: (clientId: string) => void;
  addSubmittedPlayer: (id: string) => void;
  clearSubmittedPlayers: () => void;
  setPlayerDisconnected: (id: string) => void;
  setPlayerReconnected: (id: string) => void;
  updatePlayerScores: (chain: IChain[]) => void;
  updatePlayerVotes: (votes: Record<string, number>) => void;
}

class PlayerManager extends Schema
  implements IPlayerManager, IPlayerManagerData {
  private stickyNoteColourManager = new StickyNoteColourManager();

  @type({ map: Player })
  playerMap = new MapSchema<Player>();

  get players() {
    return this.playerMap;
  }

  get playerArray(): Player[] {
    return objectValues(this.playerMap);
  }

  get numPlayers() {
    return this.playerArray.length;
  }

  get allPlayersSubmitted(): boolean {
    return this.playerArray.every((player) => player.submitted);
  }

  addPlayer = (clientId: string, username: string): ServerError | null => {
    if (this.numPlayers >= MAX_PLAYERS) {
      return ServerError.TOO_MANY_PLAYERS;
    }

    if (this.playerArray.some((p) => p.username === username)) {
      return ServerError.CONFLICTING_USERNAMES;
    }

    const player = new Player(clientId, username);
    player.stickyNoteColour = this.stickyNoteColourManager.getColour();

    this.playerMap[player.id] = player;
    return null;
  };

  removePlayer = (clientId: string) => {
    const player = this.getPlayer(clientId);
    if (player) {
      this.stickyNoteColourManager.releaseColour(player.stickyNoteColour);
      delete this.playerMap[player.id];
    }
  };

  getPlayer = (clientId: string): Player | undefined => {
    return this.playerMap[clientId];
  };

  addSubmittedPlayer = (id: string): void => {
    const player = this.getPlayer(id);
    if (player) {
      player.submitted = true;
    }
  };

  clearSubmittedPlayers = (): void => {
    this.playerArray.forEach((player) => {
      player.submitted = false;
    });
  };

  setPlayerDisconnected = (id: string): void => {
    const player = this.getPlayer(id);
    if (player) {
      player.disconnected = true;
    }
  };

  setPlayerReconnected = (id: string): void => {
    const player = this.getPlayer(id);
    if (player) {
      player.disconnected = false;
    }
  };

  updatePlayerScores = (chains: IChain[]) => {
    // reset scores so this function is idempotent
    this.playerArray.forEach((player) => {
      player.score = 0;
    });

    for (const chain of chains) {
      for (let i = 2; i < chain.links.length; i++) {
        const currentPrompt = chain.links[i].data;
        const previousPrompt = chain.links[i - 2].data;
        if (
          chain.links[i].type === LinkType.PROMPT &&
          currentPrompt &&
          previousPrompt &&
          closeEnough(currentPrompt, previousPrompt)
        ) {
          const goodDrawer = this.getPlayer(chain.links[i - 1].playerId);
          const correctGuesser = this.getPlayer(chain.links[i].playerId);

          if (goodDrawer) {
            goodDrawer.score++;
          }

          if (correctGuesser) {
            correctGuesser.score++;
          }
        }
      }
    }
  };

  updateRoundData = (chains: IChain[], round: number) => {
    this.playerArray.forEach((player) => {
      player.roundData = null;
    });

    for (const chain of chains) {
      const previousLink = chain.links[round - 1];
      const link = chain.links[round];
      const player = this.getPlayer(link.playerId);
      if (player) {
        player.roundData = previousLink as Link;
      }
    }
  };

  updatePlayerVotes = (votes: Record<string, number>) => {
    this.playerArray.forEach((player) => {
      player.votes = votes[player.id] ?? 0;
    });
  };
}

export default PlayerManager;
