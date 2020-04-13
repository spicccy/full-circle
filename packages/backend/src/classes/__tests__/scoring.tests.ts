import { PhaseType } from '@full-circle/shared/lib/roomState/constants';
import { mocked } from 'ts-jest/utils';

import { addPlayers, mockRoom } from '../helpers/testHelper';
import RoomState from '../roomState';
import Player from '../subSchema/player';

describe('room scoring', () => {
  let roomState: RoomState;
  let playerIds: string[];

  beforeAll(() => {
    roomState = new RoomState(mockRoom, { predictableChains: true });
    addPlayers(roomState, 5);
    playerIds = [];
    for (const id in roomState.players) {
      playerIds.push(id);
    }
  });

  it('should initially return all zero-scores', () => {
    for (const id in roomState.players) {
      const player: Player = roomState.players[id];
      expect(player.score).toBe(0);
    }
  });
});
