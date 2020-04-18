import { createAction } from 'typesafe-actions';

import { IChain, RoomErrorType } from '../roomState';

export const warn = createAction('@server/warn')<RoomErrorType>();

export const reconnect = createAction('@server/reconnect')<string>();

export const forceSubmit = createAction('@server/forceSubmit')();

export const curatorReveal = createAction('@server/curatorReveal')<IChain>();
