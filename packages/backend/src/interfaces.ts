import { Client } from 'colyseus';

export type IClient = Pick<Client, 'id' | 'sessionId' | 'close'>;
