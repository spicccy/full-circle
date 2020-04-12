import { createAction } from 'typesafe-actions';

import { CanvasAction } from '../canvas';
import { RoomErrorType } from '../roomState/interfaces';

export const submitDrawing = createAction('@client/submitDrawing')<
  CanvasAction[]
>();

export const submitGuess = createAction('@client/submitGuess')<string>();

export const notifyPlayerReady = createAction('@client/notifyPlayerReady')();

export const clientError = createAction('@client/warn')<RoomErrorType>();
