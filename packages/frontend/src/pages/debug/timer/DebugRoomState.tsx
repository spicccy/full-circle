import React, { FunctionComponent } from 'react';
import { useRoomState } from 'src/hooks/useRoomState';
import styled from 'styled-components';

const Debug = styled.pre`
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 8px;
  border-radius: 8px;
`;

export const DebugRoomState: FunctionComponent<{ debug?: boolean }> = ({
  debug,
}) => {
  const roomState = useRoomState();

  if (!debug) {
    return null;
  }

  return (
    <Debug>
      {roomState ? JSON.stringify(roomState, undefined, 2) : 'no room'}
    </Debug>
  );
};
