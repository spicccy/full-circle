import React, { FunctionComponent } from 'react';
import { Box, Heading } from 'grommet';
import { useRoom } from 'src/contexts/RoomContext';
import { Redirect } from 'react-router-dom';
import { DrawPage } from './DrawPage';

const GamePage: FunctionComponent = () => {
  const { room } = useRoom();

  if (!room) {
    return <Redirect to="/" />;
  }

  return (
    <Box fill>
      <Box flex align="center" justify="center">
        <Box width="medium">
          <Heading>spicccy.</Heading>
          <Box>
            <Heading>Room {room.id}</Heading>
            <DrawPage room={room} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export { GamePage };
