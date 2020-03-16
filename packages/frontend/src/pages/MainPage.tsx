import React, { FunctionComponent } from 'react';
import { Button, Box, Heading } from 'grommet';
import { useRoom } from 'src/contexts/RoomContext';
import { Canvas } from 'src/components/Canvas/Canvas';
import { useHistory } from 'react-router-dom';

const MainPage: FunctionComponent = () => {
  const { room, leaveRoom } = useRoom();
  const history = useHistory();

  return (
    <Box fill>
      <Box flex align="center" justify="center">
        <Box width="medium">
          <Heading>spicccy.</Heading>
          <Canvas />
          {room ? <h1>Room {room.id}</h1> : null}
          <Button
            onClick={() => {
              leaveRoom();
              history.push('/');
            }}
            label="Leave Room"
          />
        </Box>
      </Box>
    </Box>
  );
};

export { MainPage };
