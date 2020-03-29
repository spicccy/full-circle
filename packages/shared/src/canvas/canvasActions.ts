import { createAction } from 'typesafe-actions';

import { ICoord, Pen } from './interfaces';

export const clearCanvas = createAction('@canvas/clearCanvas')();

export const drawStroke = createAction('@canvas/drawStrokeAction')<{
  pen: Pen;
  points: ICoord[];
}>();
