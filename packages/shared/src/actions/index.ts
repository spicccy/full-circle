import * as clientActions from './client';
import * as serverActions from './server';
import { ActionType } from 'typesafe-actions';

export type ClientAction = ActionType<typeof clientActions>;
export type ServerAction = ActionType<typeof serverActions>;
