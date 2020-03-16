import * as clientActions from './client';
import { ActionType } from 'typesafe-actions';

export type ClientAction = ActionType<typeof clientActions>;
