import { Box, Text } from 'grommet';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { LinkAnchor } from 'src/components/Link/LinkAnchor';
import { useRoom } from 'src/contexts/RoomContext';

import { useRoomLeave } from '../../../hooks/useRoomListeners';
import { LoginCard } from './LoginCard';

interface ILoginPageParams {
  roomCode?: string;
}

const LoginPage: FunctionComponent = () => {
  const { room, joinRoomByCode, roomError } = useRoom();
  const params = useParams<ILoginPageParams>();

  const [name, setName] = useState(localStorage.getItem('username') ?? '');
  const [roomCode, setRoomCode] = useState(params.roomCode ?? '');

  useRoomLeave((code: number) => {
    switch (code) {
      case 1:
        alert('Someone else has already chosen that username');
        break;
      default:
        alert('Unknown error');
    }
  });

  const attemptToJoinRoom = async () => {
    localStorage.setItem('username', name);
    await joinRoomByCode(roomCode, { username: name });
  };

  useEffect(() => {
    if (roomError) {
      alert(roomError);
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
