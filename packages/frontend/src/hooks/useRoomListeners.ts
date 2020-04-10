import { ServerAction } from '@full-circle/shared/lib/actions';
import { useEffect, useRef, useState } from 'react';
import { useRoom } from 'src/contexts/RoomContext';

export const useRoomMessage = (msgHandler: (message: ServerAction) => void) => {
  const { addMessageListener } = useRoom();
  const handlerRef = useRef(msgHandler);

  const [messages, setMessages] = useState<ServerAction[]>([]);

  useEffect(() => {
    const clearListener = addMessageListener((message) =>
      handlerRef.current(message)
    );
    return clearListener;
  }, [addMessageListener]);
};

export const useRoomLeave = (msgHandler: (code: number) => void) => {
  const { addLeaveListener } = useRoom();
  const handlerRef = useRef(msgHandler);

  useEffect(() => {
    handlerRef.current = msgHandler;
  }, [msgHandler]);

  useEffect(() => {
    const clearListener = addLeaveListener((code) => handlerRef.current(code));
    return clearListener;
  }, [addLeaveListener]);
};
