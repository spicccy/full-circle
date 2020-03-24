import React, { FunctionComponent } from 'react';
import { Box, Heading, Button, Paragraph } from 'grommet';
import { Add } from 'grommet-icons';
import logo from 'src/images/fullcircle.png';
import { LinkButton } from 'src/components/Link/LinkButton';

import { useRoom } from 'src/contexts/RoomContext';

interface ILobbyProps {
  startGame(): void;
}

const Lobby: FunctionComponent<ILobbyProps> = ({ startGame }) => {
  const { room } = useRoom();

  return (
    <Box background="light-2" fill>
      <LinkButton alignSelf="start" label="Back" href="/home" />
      <Box flex align="center" justify="center">
        <Box width="medium" align="center">
          <img alt="Full Circle" width={100} height={100} src={logo} />
          <Heading>Full Circle</Heading>
          <Box align="center">
            <Paragraph>Room ID : {room?.id} </Paragraph>
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