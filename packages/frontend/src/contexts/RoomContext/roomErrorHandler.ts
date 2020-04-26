import { RoomError } from '@full-circle/shared/lib/roomState';
import { MatchMakeError } from 'colyseus.js/lib/Client';

export const parseRoomError = (error: unknown): RoomError => {
  console.log('room error', JSON.parse(JSON.stringify(error)));
  // Error from websocket
  if (error instanceof ProgressEvent) {
    return RoomError.NETWORK_ERROR;
  }

  // Error from colyseus
  if (error instanceof MatchMakeError) {
    switch (error.code) {
      case 4214:
        return RoomError.RECONNECT_ERROR;
      default:
        return RoomError.ROOM_NOT_FOUND;
    }
  }

  // Dunno
  console.warn('unknown error', error);
  return RoomError.UNKNOWN_ERROR;
};
