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
  broadcast: jest.fn(),
  clients: [],
};

export const mockClient: IClient = {
  id: '',
};

export const createTestPlayer = (num: number): Player => {
  return new Player(`${num}_id`, `${num}_username`);
};

export const addPlayers = (roomState: RoomState, nPlayers: number) => {
  for (let i = 0; i < nPlayers; i++) {
    roomState.addPlayer(`${i}_id`, `${i}_username`);
  }
};
