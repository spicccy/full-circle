import 'styled-components/macro';

import { Box, Button, Heading, Paragraph } from 'grommet';
import { Launch } from 'grommet-icons';
import QR from 'qrcode.react';
import React, { FunctionComponent } from 'react';
import { LinkButton } from 'src/components/Link/LinkButton';
import { useRoom } from 'src/contexts/RoomContext';
import logo from 'src/images/fullcircle.png';

import { CopyLink } from '../../../components/Link/CopyLink';

interface ILobbyProps {
  startGame(): void;
}

const Lobby: FunctionComponent<ILobbyProps> = ({ startGame }) => {
  const { syncedState, roomCode, leaveRoom } = useRoom();

  const nPlayers = Object.keys(syncedState?.playerManager.playerMap ?? {})
    .length;

  const joinUrl = process.env.REACT_APP_FRONTEND_URL + '/join/' + roomCode;

  return (
    <Box>
      <LinkButton
        alignSelf="start"
        label="Back"
        href="/create"
        onClick={leaveRoom}
      />
      <Box flex align="center" justify="center">
        <Box width="medium" align="center">
          <img alt="Full Circle" width={100} height={100} src={logo} />
          <Heading>Full Circle</Heading>
          <Heading level="3" data-testid="roomID">
            Room: {roomCode}
          </Heading>
          <QR value={joinUrl} about={`Join room ${roomCode}`}></QR>
          <Paragraph size="small">Quick join QR code</Paragraph>
          <Paragraph size="small">
            Copy this link to your friends
            <CopyLink url={joinUrl} />
          </Paragraph>
          <Button
            alignSelf="center"
            label="Start Game"
            icon={<Launch />}
            onClick={startGame}
            data-testid="startGame"
            disabled={nPlayers < 3}
            size="large"
          />
        </Box>
      </Box>
    </Box>
  );
};

export { Lobby };
