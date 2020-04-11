import { Client, Clock, Room } from 'colyseus';

export type IClient = Pick<Client, 'id' | 'sessionId' | 'close'>;

export type IClock = Pick<Clock, 'setTimeout'>;

export type IRoom = Pick<Room, 'send' | 'clients'> & { clock: IClock };
