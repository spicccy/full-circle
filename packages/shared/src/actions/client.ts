import { createAction } from 'typesafe-actions';
import { CanvasAction } from '../canvas/interfaces';

export const submitDrawing = createAction('@client/submitDrawing')<
  CanvasAction[]
>();
