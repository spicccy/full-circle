import { createAction } from 'typesafe-actions';

import { CanvasAction } from '../canvas';
import { IChain, Warning } from '../roomState/interfaces';

export const displayDrawing = createAction('@server/displayDrawing')<
  CanvasAction[]
>();

export const displayPrompt = createAction('@server/displayPrompt')<string>();

export const warn = createAction('@server/warn')<Warning>();

export const forceSubmit = createAction('@server/forceSubmit')();

export const curatorReveal = createAction('@server/curatorReveal')<IChain[]>();
