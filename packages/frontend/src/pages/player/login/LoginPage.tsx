import { Warning } from '@full-circle/shared/lib/roomState/interfaces';
import { Box, Text } from 'grommet';
import React, { useEffect, useState } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { LinkAnchor } from 'src/components/Link/LinkAnchor';
import { useRoom } from 'src/contexts/RoomContext';

import { LoginCard } from './LoginCard';

interface ILoginPageParams {
  roomCode?: string;
}

const LoginPage: React.FC = () => {
  const { room, joinRoomByCode, roomError } = useRoom();
  const params = useParams<ILoginPageParams>();

  const [name, setName] = useState(localStorage.getItem('username') ?? '');
  const [roomCode, setRoomCode] = useState(params.roomCode ?? '');

  const [error, setError] = useState<'username' | 'roomCode' | undefined>(
    undefined
  );

  const attemptToJoinRoom = async () => {
    localStorage.setItem('username', name);
    await joinRoomByCode(roomCode, { username: name });
  };

  useEffect(() => {
    if (roomError) {
      if (roomError === Warning.CONFLICTING_USERNAMES) {
        localStorage.removeItem('username');
        setName('');
        setError('username');
      }

      // TODO: fix this raf hack
      // need to wait 2af on chrome+firefox in order for the border to show up before the alert
      // this can probably be removed once we move away from alerts to a popup method
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          alert(roomError);
        });
      });
    }
  }, [roomError]);

  if (room) {
    return <Redirect to="/play" />;
  }

  return (
    <Box
      background="dark-1"
      flex
      height={{ min: '100vh' }}
      align="center"
      justify="center"
      pad="medium"
    >
      <Box width="medium" margin={{ bottom: 'medium' }}>
        <LoginCard
          name={name}
          setName={setName}
          roomCode={roomCode}
          setRoomCode={setRoomCode}
          attemptToJoinRoom={attemptToJoinRoom}
          error={error}
        />
      </Box>
      <Text>
        OR create a new game{' '}
        <LinkAnchor data-testid="newGame" href="/create">
          here
        </LinkAnchor>
      </Text>
    </Box>
  );
};

export { LoginPage };
