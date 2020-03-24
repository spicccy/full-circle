import React, { FunctionComponent } from 'react';
import { Box } from 'grommet';
import { useRoom } from 'src/contexts/RoomContext';
import { Redirect } from 'react-router-dom';
import { DrawPage } from './DrawPage';

const PlayerGamePage: FunctionComponent = () => {
  const { room } = useRoom();

  if (!room) {
    return <Redirect to="/" />;
  }

  return (
    <Box fill flex align="center" justify="center">
      <Box width="medium">
        <DrawPage room={room} />
      </Box>
    </Box>
  );
};

export { PlayerGamePage };
