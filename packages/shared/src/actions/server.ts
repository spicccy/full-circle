import { createAction } from 'typesafe-actions';

import { IChain, RoomErrorType } from '../roomState/interfaces';

export const displayDrawing = createAction('@server/displayDrawing')<string>();

export const displayPrompt = createAction('@server/displayPrompt')<string>();

export const warn = createAction('@server/warn')<RoomErrorType>();

export const reconnect = createAction('@server/reconnect')<string>();

export const forceSubmit = createAction('@server/forceSubmit')();

export const curatorReveal = createAction('@server/curatorReveal')<IChain[]>();

export const throwServerWarning = (error: RoomErrorType) => {
  throw new Error(JSON.stringify(warn(error)));
};

export const sendReconnect = (clientId: string) => {
  throw new Error(JSON.stringify(reconnect(clientId)));
};
