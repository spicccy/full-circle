import { MapSchema, Schema, type } from '@colyseus/schema';
import { Vote } from '@full-circle/shared/lib/actions/client';
import { reconnect } from '@full-circle/shared/lib/actions/server';
import { objectValues } from '@full-circle/shared/lib/helpers';
import {
  IChain,
  IPlayer,
  IPlayerManagerData,
  LinkType,
  RoomErrorType,
} from '@full-circle/shared/lib/roomState';

import { CURATOR_USERNAME, MAX_PLAYERS } from '../../../constants';
import { closeEnough, throwJoinRoomError } from '../../../util/util';
import Link from '../../subSchema/link';
import Player from '../../subSchema/player';
import { StickyNoteColourManager } from '../stickyNoteColourManager';

interface IPlayerManager {
  readonly players: MapSchema<Player>;
  readonly playerArray: Player[];
  readonly numPlayers: number;
  readonly allPlayersSubmitted: boolean;
  addPlayer: (player: IPlayer) => RoomErrorType | null;
  removePlayer: (playerId: string) => void;
  getPlayer: (id: string) => void;
  addSubmittedPlayer: (id: string) => void;
  clearSubmittedPlayers: () => void;
  setPlayerDisconnected: (id: string) => void;
  setPlayerReconnected: (id: string) => void;
  attemptReconnection: (username: string) => void;
  updatePlayerScores: (chain: IChain[]) => void;
  addVote: (vote: Vote) => void;
}

class PlayerManager extends Schema
  implements IPlayerManager, IPlayerManagerData {
  stickyNoteColourManager = new StickyNoteColourManager();

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

  addPlayer = (player: IPlayer): RoomErrorType | null => {
    if (player.username === CURATOR_USERNAME) {
      return RoomErrorType.RESERVED_USERNAME;
    }

    if (this.numPlayers >= MAX_PLAYERS) {
      return RoomErrorType.TOO_MANY_PLAYERS;
    }

    if (this.playerArray.some((p) => p.username === player.username)) {
      return RoomErrorType.CONFLICTING_USERNAMES;
    }

    const { id } = player;
    this.playerMap[id] = player;
    player.stickyNoteColour = this.stickyNoteColourManager.getColour();
    return null;
  };

  removePlayer = (playerId: string) => {
    const player = this.getPlayer(playerId);
    if (player) {
      this.stickyNoteColourManager.releaseColour(player.stickyNoteColour);
    }

    delete this.playerMap[playerId];
  };

  getPlayer = (id: string): Player | undefined => {
    return this.playerMap[id];
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

  attemptReconnection = (username: string) => {
    const player = this.playerArray.find((p) => p.username === username);
    if (player && player.disconnected) {
      throwJoinRoomError(reconnect(player.id));
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
      player.roundData = undefined;
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

  addVote = (vote: Vote) => {
    const player = this.getPlayer(vote.playerId);
    if (player) {
      player.votes += vote.vote === 'dislike' ? -1 : 1;
    }
  };
}

export default PlayerManager;
