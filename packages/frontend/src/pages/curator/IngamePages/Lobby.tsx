import 'styled-components/macro';

import { Box, Button, Heading, Paragraph } from 'grommet';
import { Add, Clipboard as ClipboardIcon } from 'grommet-icons';
import QR from 'qrcode.react';
import React, { FunctionComponent } from 'react';
import Clipboard from 'react-clipboard.js';
import { LinkButton } from 'src/components/Link/LinkButton';
import { PlayerBackground } from 'src/components/PlayerBackground';
import { useRoom } from 'src/contexts/RoomContext';
import logo from 'src/images/fullcircle.png';

interface ILobbyProps {
  startGame(): void;
}

const Lobby: FunctionComponent<ILobbyProps> = ({ startGame }) => {
  const { syncedState, roomCode, leaveRoom } = useRoom();

  const nPlayers = Object.keys(syncedState?.players ?? {}).length;
  const joinUrl = `${process.env.REACT_APP_BACKEND_URL}/join/${roomCode}`;

  return (
    <Box css={{ position: 'relative' }} fill>
      <PlayerBackground />
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
          <Box align="center" margin="medium">
            <Heading level="3" data-testid="roomID">
              Room: {roomCode}
            </Heading>
            <Paragraph>Quick join QR code</Paragraph>
            <QR value={joinUrl} about={`Join room ${roomCode}`}></QR>
            <Paragraph>Copy this link to your friends</Paragraph>
            <div
              css={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <a href={joinUrl}>{joinUrl}</a>
              <Clipboard data-clipboard-text={joinUrl}>
                <ClipboardIcon />
              </Clipboard>
            </div>
          </Box>
          <Button
            alignSelf="center"
            label="Start Game"
            icon={<Add />}
            onClick={startGame}
            disabled={nPlayers < 3}
          />
        </Box>
      </Box>
    </Box>
  );
};

export { Lobby };
