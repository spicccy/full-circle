import { createAction } from 'typesafe-actions';

import { IChain, RoomErrorType } from '../roomState';

export const warn = createAction('@server/warn')<RoomErrorType>();

export const reconnect = createAction('@server/reconnect')<string>();

export const curatorReveal = createAction('@server/curatorReveal')<IChain>();

export const becomeCurator = createAction('@server/becomeCurator')();
