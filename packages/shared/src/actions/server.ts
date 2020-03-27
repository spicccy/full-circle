import { createAction } from 'typesafe-actions';

import { CanvasAction } from '../canvas/interfaces';

export const displayDrawing = createAction('@server/displayDrawing')<
  CanvasAction[]
>();

export const displayPrompt = createAction('@server/displayPrompt')<string>();
