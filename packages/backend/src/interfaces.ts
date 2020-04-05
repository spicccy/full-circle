import { Client, Clock } from 'colyseus';

export type IClient = Pick<Client, 'id' | 'sessionId' | 'close'>;

export type IClock = Pick<Clock, 'setTimeout'>;
