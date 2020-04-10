import { createAction } from 'typesafe-actions';

import { CanvasAction } from '../canvas';

export const displayDrawing = createAction('@server/displayDrawing')<
  CanvasAction[]
>();

export const displayPrompt = createAction('@server/displayPrompt')<string>();

export const warn = createAction('@server/warn')<string>();
