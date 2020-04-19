import { IPlayer } from '@full-circle/shared/lib/roomState';

import { IClient, IClock, IRoom } from '../../interfaces';
import RoomState from '../roomState';
import Player from '../subSchema/player';

export const mockClock: IClock = {
  setTimeout: jest.fn().mockReturnValue({
    clear: jest.fn(),
  }),
};

export const mockRoom: IRoom = {
  clock: mockClock,
  send: jest.fn(),
  clients: [],
};

export const mockClient: IClient = {
  id: '',
  sessionId: '',
  close: () => {
    return;
  },
};

export const createTestPlayer = (num: number): Player => {
  return new Player(`${num}_id`, `${num}_username`);
};

export const addPlayers = (roomState: RoomState, nPlayers: number) => {
  for (let i = 0; i < nPlayers; i++) {
    roomState.addPlayer(createTestPlayer(i));
  }
};
