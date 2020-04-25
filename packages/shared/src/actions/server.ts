import { createAction } from 'typesafe-actions';

import { ServerError } from '../roomState';

export const serverError = createAction('@server/error')<ServerError>();

export const joinGameError = createAction('@server/joinGameError')<
  ServerError
>();
