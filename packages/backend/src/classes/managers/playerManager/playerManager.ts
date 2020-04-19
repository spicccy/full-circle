import { MapSchema, Schema, type } from '@colyseus/schema';
import { reconnect } from '@full-circle/shared/lib/actions/server';
import { objectValues } from '@full-circle/shared/lib/helpers';
import {
  IChain,
  IPlayer,
  IPlayerManagerData,
  RoomErrorType,
} from '@full-circle/shared/lib/roomState';

import { CURATOR_USERNAME, MAX_PLAYERS } from '../../../constants';
import { closeEnough, throwJoinRoomError } from '../../../util/util';
import Player from '../../subSchema/player';

interface IPlayerManager {
  readonly numPlayers: number;
  readonly allPlayersSubmitted: boolean;
  readonly unsubmittedPlayerIds: string[];
  readonly players: MapSchema<Player>;
  addPlayer: (player: IPlayer) => RoomErrorType | null;
  removePlayer: (playerId: string) => void;
  getPlayer: (id: string) => void;
  addSubmittedPlayer: (id: string) => void;
  clearSubmittedPlayers: () => void;
  setPlayerDisconnected: (id: string) => void;
  setPlayerReconnected: (id: string) => void;
  attemptReconnection: (username: string) => void;
  updatePlayerScores: (chain: IChain[]) => void;
}

class PlayerManager extends Schema
  implements IPlayerManager, IPlayerManagerData {
  @type({ map: Player })
  playerMap = new MapSchema<Player>();

  @type({ map: 'boolean' })
  submittedPlayers = new MapSchema<boolean>();

  get players() {
    return this.playerMap;
  }

  get numPlayers() {
    return Object.keys(this.playerMap).length;
  }

  get allPlayersSubmitted(): boolean {
    return objectValues(this.submittedPlayers).every(Boolean);
  }

  get unsubmittedPlayerIds(): string[] {
    const ids = [];
    for (const playerId in this.submittedPlayers) {
      if (!this.submittedPlayers[playerId]) {
        ids.push(playerId);
      }
    }

    return ids;
  }

  addPlayer = (player: IPlayer): RoomErrorType | null => {
    if (player.username === CURATOR_USERNAME) {
      return RoomErrorType.RESERVED_USERNAME;
    }

    if (this.numPlayers >= MAX_PLAYERS) {
      return RoomErrorType.TOO_MANY_PLAYERS;
    }

    for (const id in this.playerMap) {
      const existingPlayer: Player = this.playerMap[id];
      if (player.username === existingPlayer.username) {
        return RoomErrorType.CONFLICTING_USERNAMES;
      }
    }

    const { id } = player;
    this.playerMap[id] = player;
    this.submittedPlayers[id] = false;
    return null;
  };

  removePlayer = (playerId: string) => {
    delete this.playerMap[playerId];
    delete this.submittedPlayers[playerId];
  };

  getPlayer = (id: string): IPlayer | undefined => {
    return this.playerMap[id];
  };

  addSubmittedPlayer = (id: string): void => {
    this.submittedPlayers[id] = true;
  };

  clearSubmittedPlayers = (): void => {
    for (const playerId in this.submittedPlayers) {
      this.submittedPlayers[playerId] = false;
    }
  };

  setPlayerDisconnected = (id: string): void => {
    const player: Player = this.playerMap[id];
    player.disconnected = true;
  };

  setPlayerReconnected = (id: string): void => {
    const player: Player = this.playerMap[id];
    player.disconnected = false;
  };

  attemptReconnection = (username: string) => {
    for (const id in this.playerMap) {
      const player: Player = this.playerMap[id];
      if (player.username === username && player.disconnected) {
        throwJoinRoomError(reconnect(player.id));
      }
    }
  };

  updatePlayerScores = (chains: IChain[]) => {
    // reset scores so this function is idempotent
    for (const id in this.playerMap) {
      this.playerMap[id].score = 0;
    }

    for (const chain of chains) {
      for (let i = 2; i < chain.links.length; i++) {
        if (
          chain.links[i].type === 'prompt' &&
          closeEnough(chain.links[i].data, chain.links[i - 2].data)
        ) {
          const goodDrawer = chain.links[i - 1].playerId;
          const correctGuesser = chain.links[i].playerId;
          this.playerMap[correctGuesser].score++;
          this.playerMap[goodDrawer].score++;
        }
      }
    }
  };

  updateRoundData = (chains: IChain[], round: number) => {
    for (const playerId in this.playerMap) {
      const player = this.getPlayer(playerId);
      if (player) {
        player.roundData = undefined;
      }
    }

    for (const chain of chains) {
      const previousLink = chain.links[round - 1];
      const link = chain.links[round];
      const player = this.getPlayer(link.playerId);
      if (player) {
        player.roundData = previousLink;
      }
    }
  };
}

export default PlayerManager;
