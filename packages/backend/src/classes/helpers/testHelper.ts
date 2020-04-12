import { IPlayer } from '@full-circle/shared/lib/roomState/interfaces';

import { IClient, IClock, IRoom } from '../../interfaces';
import RoomState from '../roomState';

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

export const createTestPlayer = (num: number): IPlayer => {
  return {
    id: `${num}_id`,
    username: `${num}_username`,
    disconnected: false,
  };
};

export const addPlayers = (roomState: RoomState, nPlayers: number) => {
  for (let i = 0; i < nPlayers; i++) {
    roomState.addPlayer(createTestPlayer(i));
  }
};
