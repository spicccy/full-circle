import { Client, Clock } from 'colyseus';

export type IClient = Client;

export type IClock = Pick<Clock, 'setTimeout'>;
