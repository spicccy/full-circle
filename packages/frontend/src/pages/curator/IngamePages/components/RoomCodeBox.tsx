import { Box, Text } from 'grommet';
import QR from 'qrcode.react';
import React, { FunctionComponent } from 'react';
import { useRoom } from 'src/contexts/RoomContext';
import styled from 'styled-components';

const StyledBox = styled(Box)`
  position: absolute;
  left: 50px;
  bottom: 70px;
`;

const RoomCodeBox: FunctionComponent = () => {
  const { roomCode } = useRoom();

  const joinUrl = process.env.REACT_APP_FRONTEND_URL + '/join/' + roomCode;

  return (
    <StyledBox align="center">
      <Text>
        <b>Room code:</b> {roomCode}
      </Text>
      <QR size={96} value={joinUrl} />
    </StyledBox>
  );
};

export { RoomCodeBox };
