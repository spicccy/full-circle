import { ServerAction } from '@full-circle/shared/lib/actions';
import { useEffect, useRef } from 'react';
import { useRoom } from 'src/contexts/RoomContext';

export const useRoomMessage = (msgHandler: (message: ServerAction) => void) => {
  const { room, addMessageListener } = useRoom();
  const handlerRef = useRef(msgHandler);

  useEffect(() => {
    handlerRef.current = msgHandler;
  }, [msgHandler]);

  useEffect(() => {
    if (room) {
      const clearListener = addMessageListener((message) =>
        handlerRef.current(message)
      );
      return clearListener;
    }
  }, [addMessageListener, room]);
};

export const useRoomLeave = (msgHandler: (code: number) => void) => {
  const { room, addLeaveListener } = useRoom();
  const handlerRef = useRef(msgHandler);

  useEffect(() => {
    handlerRef.current = msgHandler;
  }, [msgHandler]);

  useEffect(() => {
    if (room) {
      const clearListener = addLeaveListener((code) =>
        handlerRef.current(code)
      );
      return clearListener;
    }
  }, [addLeaveListener, room]);
};
