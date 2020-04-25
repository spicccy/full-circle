import { ActionType } from 'typesafe-actions';

import * as clientActions from './client';
import * as serverActions from './server';

export type ClientAction = ActionType<typeof clientActions>;
export type ServerAction = ActionType<typeof serverActions>;
