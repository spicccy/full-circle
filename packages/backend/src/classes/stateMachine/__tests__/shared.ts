import { IClient } from '../../../interfaces';

export const testCurator: IClient = {
  id: 'curator',
  sessionId: '',
  close: () => {
    return;
  },
};

export const testPlayer: IClient = {
  id: 'player',
  sessionId: '',
  close: () => {
    return;
  },
};
