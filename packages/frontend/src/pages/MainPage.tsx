import React, { FunctionComponent } from 'react';
import { Button, Box, Heading } from 'grommet';
import { useRoom } from 'src/contexts/RoomContext';
import { Canvas } from 'src/components/Canvas/Canvas';

const MainPage: FunctionComponent = () => {
  const { room, createAndJoinRoom, leaveRoom } = useRoom();

  return (
    <Box fill>
      <Box flex align="center" justify="center">
        <Box width="medium">
          <Heading>spicccy.</Heading>
          <Canvas />
          {room ? <h1>Room {room.id}</h1> : null}
          <Button onClick={createAndJoinRoom} label="Join Room" />
          <Button onClick={leaveRoom} label="Leave Room" />
        </Box>
      </Box>
    </Box>
  );
};

export { MainPage };
