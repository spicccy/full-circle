import { createAction } from 'typesafe-actions';

import { CanvasAction } from '../canvas';

export const submitDrawing = createAction('@client/submitDrawing')<
  CanvasAction[]
>();

export const submitGuess = createAction('@client/submitGuess')<string>();

export const notifyPlayerReady = createAction('@client/notifyPlayerReady')();
