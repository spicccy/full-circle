import 'styled-components/macro';

import { Colour } from '@full-circle/shared/lib/canvas';
import { Box, Button, Heading, Paragraph } from 'grommet';
import { Launch } from 'grommet-icons';
import QR from 'qrcode.react';
import React, { FunctionComponent } from 'react';
import { LinkButton } from 'src/components/Link/LinkButton';
import { useRoom } from 'src/contexts/RoomContext';
import styled from 'styled-components/macro';

import { CopyLink } from '../../../components/Link/CopyLink';
import { RoomCodeBox } from './components/RoomCodeBox';

interface ILobbyProps {
  startGame(): void;
}

const BackButton = styled(LinkButton)`
  position: fixed;
  top: 25px;
  left: 35px;
`;

const Lobby: FunctionComponent<ILobbyProps> = ({ startGame }) => {
  const { syncedState, roomCode, leaveRoom } = useRoom();

  const nPlayers = Object.keys(syncedState?.playerManager.playerMap ?? {})
    .length;

  const joinUrl = process.env.REACT_APP_FRONTEND_URL + '/join/' + roomCode;

  return (
    <Box flex>
      <BackButton label="Back" href="/create" onClick={leaveRoom} />
      <Box flex align="center" justify="center">
        <Box align="center">
          <Heading color={Colour.BLUE} level="1" data-testid="roomID">
            Room: {roomCode}
          </Heading>
          <QR value={joinUrl} about={`Join room ${roomCode}`}></QR>
          <Paragraph color={Colour.DARK_GRAY} size="small">
            Quick join QR code
          </Paragraph>
          <Paragraph color={Colour.DARK_GRAY} size="small">
            Copy this link to your friends
          </Paragraph>
          <CopyLink url={joinUrl} />

          <Button
            label="Start Game"
            icon={<Launch />}
            onClick={startGame}
            data-testid="startGame"
            disabled={nPlayers < 3}
            size="large"
            margin="medium"
          />
        </Box>
      </Box>
    </Box>
  );
};

export { Lobby };
