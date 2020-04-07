import { IClient, IClock } from '../../interfaces';
import RoomState from '../roomState';

export const mockClock: IClock = {
  setTimeout: jest.fn().mockReturnValue({
    clear: jest.fn(),
  }),
};

export const mockClient: IClient = {
  id: '',
  sessionId: '',
  close: () => {
    return;
  },
};

export const addPlayers = (roomState: RoomState, nPlayers: number) => {
  for (let i = 0; i < nPlayers; i++) {
    roomState.addPlayer({
      id: `playerId${i}`,
      username: `playerUsername${i}`,
    });
  }
};
