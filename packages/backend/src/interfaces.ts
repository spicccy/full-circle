import { Client } from 'colyseus';

export type IClient = Pick<Client, 'id' | 'sessionId' | 'close'>;

export type IRoomMetada = {
  roomCode: string;
};
