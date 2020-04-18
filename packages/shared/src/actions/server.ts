import { createAction } from 'typesafe-actions';

import { IChain } from '../roomState/chain';
import { RoomErrorType } from '../roomState/interfaces';

export const displayDrawing = createAction('@server/displayDrawing')<string>();

export const displayPrompt = createAction('@server/displayPrompt')<string>();

export const warn = createAction('@server/warn')<RoomErrorType>();

export const reconnect = createAction('@server/reconnect')<string>();

export const forceSubmit = createAction('@server/forceSubmit')();

export const curatorReveal = createAction('@server/curatorReveal')<IChain>();
