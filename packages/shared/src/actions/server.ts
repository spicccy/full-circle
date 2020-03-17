import { createAction } from 'typesafe-actions';
import { CanvasAction } from '../canvas/interfaces';

export const displayDrawing = createAction('@server/displayDrawing')<
  CanvasAction[]
>();
