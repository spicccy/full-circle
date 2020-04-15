import { RoomError } from '@full-circle/shared/lib/actions';
import { clientError } from '@full-circle/shared/lib/actions/client';
import { RoomErrorType } from '@full-circle/shared/lib/roomState/interfaces';
import invariant from 'tiny-invariant';

export const parseServerError = (error: unknown): RoomError => {
  // Error from websocket
  if (error instanceof ProgressEvent) {
    console.warn('network error', error);
    return clientError(RoomErrorType.NETWORK_ERROR);
  }

  // Error from colyseus
  if (typeof error === 'object') {
    console.warn('colyseus error', error);
    return clientError(RoomErrorType.ROOM_NOT_FOUND);
  }

  // Error from backend
  if (typeof error === 'string') {
    console.warn('backend error', error);
    try {
      const serverError: RoomError = JSON.parse(error);
      invariant(serverError.type, 'Ensure that the JSON.parse was valid');
      return serverError;
    } catch (e) {
      console.warn('Unknown error received from server: ', error);
      return clientError(RoomErrorType.UNKNOWN_ERROR);
    }
  }

  // Dunno
  console.warn('unknown error', error);
  return clientError(RoomErrorType.UNKNOWN_ERROR);
};
