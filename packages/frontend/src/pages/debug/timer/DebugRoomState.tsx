import React, { FunctionComponent, useState, useEffect } from 'react';
import { useRoomState } from 'src/hooks/useRoomState';
import styled from 'styled-components';
import Draggable from 'react-draggable';
import { useRoom } from 'src/contexts/RoomContext';
import { useRoomMessage } from 'src/hooks/useRoomMessage';

const Debug = styled.pre`
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 24px 8px 8px 8px;
  border-radius: 8px;
  cursor: move;
  user-select: none;
  max-height: 300px;
  overflow-y: auto;
`;

export const DebugRoomState: FunctionComponent<{ debug?: boolean }> = ({
  debug,
}) => {
  const [messages, setMessages] = useState<string[]>([]);

  const { room } = useRoom();
  const roomState = useRoomState();

  useEffect(() => {
    setMessages([]);
  }, [room]);

  useRoomMessage(message => {
    setMessages([...messages, message.type]);
  });

  if (!debug) {
    return null;
  }

  return (
    <Draggable>
      <Debug>
        Room: {room ? room.id : 'NA'}
        <br />
        Session id: {room ? room.sessionId : 'NA'}
        <br />
        Room state:
        <br />
        {roomState && JSON.stringify(roomState, undefined, 2)}
        <br />
        Room messages:
        <br />
        {JSON.stringify(messages, undefined, 2)}
      </Debug>
    </Draggable>
  );
};
