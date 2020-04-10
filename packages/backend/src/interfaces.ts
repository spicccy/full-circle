import { Client, Clock, Room } from 'colyseus';

export type IClient = Client;

export type IClock = Pick<Clock, 'setTimeout'>;

export type IRoom = Pick<Room, 'send'> & { clock: IClock };
