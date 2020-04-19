import { MapSchema, Schema, type } from '@colyseus/schema';
import { reconnect } from '@full-circle/shared/lib/actions/server';
import { objectValues } from '@full-circle/shared/lib/helpers';
import {
  IChain,
  IPlayer,
  RoomErrorType,
} from '@full-circle/shared/lib/roomState';

import { CURATOR_USERNAME, MAX_PLAYERS } from '../../../constants';
import { closeEnough, throwJoinRoomError } from '../../../util/util';
import Player from '../../subSchema/player';

interface IPlayerManager {
  readonly numPlayers: number;
  readonly allPlayersSubmitted: boolean;
  readonly unsubmittedPlayerIds: string[];
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

class PlayerManager extends Schema implements IPlayerManager {
  @type({ map: Player })
  _players = new MapSchema<Player>();

  @type({ map: 'boolean' })
  submittedPlayers = new MapSchema<boolean>();

  get players() {
    return this._players;
  }

  get numPlayers() {
    return Object.keys(this.players).length;
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

    for (const id in this.players) {
      const existingPlayer: Player = this.players[id];
      if (player.username === existingPlayer.username) {
        return RoomErrorType.CONFLICTING_USERNAMES;
      }
    }

    const { id } = player;
    this.players[id] = player;
    this.submittedPlayers[id] = false;
    return null;
  };

  removePlayer = (playerId: string) => {
    delete this.players[playerId];
    delete this.submittedPlayers[playerId];
  };

  getPlayer = (id: string): IPlayer | undefined => {
    return this.players[id];
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
    const player: Player = this.players[id];
    player.disconnected = true;
  };

  setPlayerReconnected = (id: string): void => {
    const player: Player = this.players[id];
    player.disconnected = false;
  };

  attemptReconnection = (username: string) => {
    for (const id in this.players) {
      const player: Player = this.players[id];
      if (player.username === username && player.disconnected) {
        throwJoinRoomError(reconnect(player.id));
      }
    }
  };

  updatePlayerScores = (chains: IChain[]) => {
    // reset scores so this function is idempotent
    for (const id in this.players) {
      this.players[id].score = 0;
    }

    for (const chain of chains) {
      for (let i = 2; i < chain.links.length; i++) {
        if (
          chain.links[i].type === 'prompt' &&
          closeEnough(chain.links[i].data, chain.links[i - 2].data)
        ) {
          const goodDrawer = chain.links[i - 1].playerId;
          const correctGuesser = chain.links[i].playerId;
          this.players[correctGuesser].score++;
          this.players[goodDrawer].score++;
        }
      }
    }
  };

  updateRoundData = (chains: IChain[], round: number) => {
    for (const playerId in this.players) {
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
