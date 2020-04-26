import { Box, Text } from 'grommet';
import React, { FunctionComponent, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import { LinkAnchor } from 'src/components/Link/LinkAnchor';
import { useRoom } from 'src/contexts/RoomContext';

import { Background } from '../game/components/Background';
import { LoginCard } from './LoginCard';

const LoginPage: FunctionComponent = () => {
  const { roomCode, joinRoomByCode, roomError, clearError } = useRoom();

  const { addToast } = useToasts();

  useEffect(() => {
    if (roomError) {
      clearError();
      addToast(roomError, { appearance: 'error' });
    }
  }, [addToast, clearError, roomError]);

  if (roomCode) {
    return <Redirect to={`/play/${roomCode}`} />;
  }

  return (
    <Background>
      <Box width="medium" margin={{ bottom: 'medium' }}>
        <LoginCard attemptToJoinRoom={joinRoomByCode} />
      </Box>
      <Text>
        OR create a new game{' '}
        <LinkAnchor data-testid="newGame" href="/create">
          here
        </LinkAnchor>
      </Text>
    </Background>
  );
};

export { LoginPage };
