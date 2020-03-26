import { ServerAction } from '@full-circle/shared/lib/actions';
import { useEffect, useRef } from 'react';
import { useRoom } from 'src/contexts/RoomContext';

export const useRoomMessage = (msgHandler: (message: ServerAction) => void) => {
  const { room } = useRoom();
  const handlerRef = useRef(msgHandler);

  useEffect(() => {
    handlerRef.current = msgHandler;
  }, [msgHandler]);

  useEffect(() => {
    if (room) {
      const listener = room.onMessage(message => handlerRef.current(message));
      return () => listener.clear();
    }
  }, [room]);
};
