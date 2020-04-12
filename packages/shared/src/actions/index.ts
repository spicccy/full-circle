import { ActionType } from 'typesafe-actions';

import * as clientActions from './client';
import * as serverActions from './server';

export type ClientAction = ActionType<typeof clientActions>;
export type ServerAction = ActionType<typeof serverActions>;
export type RoomError = ActionType<
  | typeof serverActions.warn // eg. username taken
  | typeof serverActions.reconnect // eg. don't use .join() use .reconnect()
  | typeof clientActions.clientError // eg. roomCode doesn't exist
>;
