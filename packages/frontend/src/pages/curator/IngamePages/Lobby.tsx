import 'styled-components/macro';

import { Box, Button, Heading, Paragraph } from 'grommet';
import { Add } from 'grommet-icons';
import React, { FunctionComponent } from 'react';
import { AllPlayersCircle } from 'src/components/AllPlayersCircle';
import { LinkButton } from 'src/components/Link/LinkButton';
import { useRoom } from 'src/contexts/RoomContext';
import logo from 'src/images/fullcircle.png';

interface ILobbyProps {
  startGame(): void;
  playerBoxes: {};
}

const Lobby: FunctionComponent<ILobbyProps> = ({ startGame, playerBoxes }) => {
  const { roomCode } = useRoom();

  return (
    <Box css={{ position: 'relative' }} fill>
      <Box
        css={{ position: 'absolute', zIndex: -1 }}
        overflow="hidden"
        fill
        align="center"
        justify="center"
      >
        <AllPlayersCircle />
        {playerBoxes}
      </Box>
      <LinkButton alignSelf="start" label="Back" href="/home" />
      <Box flex align="center" justify="center">
        <Box width="medium" align="center">
          <img alt="Full Circle" width={100} height={100} src={logo} />
          <Heading>Full Circle</Heading>
          <Box align="center">
            <Paragraph>Room ID : {roomCode}</Paragraph>
          </Box>
          <Button
            alignSelf="center"
            label="Start Game"
            icon={<Add />}
            onClick={startGame}
          />
        </Box>
      </Box>
    </Box>
  );
};

export { Lobby };
