import { Box, Text } from 'grommet';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { LinkAnchor } from 'src/components/Link/LinkAnchor';
import { useRoom } from 'src/contexts/RoomContext';

import { LoginCard } from './LoginCard';

interface ILoginPageParams {
  roomCode?: string;
}

const LoginPage: FunctionComponent = () => {
  const { room, joinRoomByCode, roomError } = useRoom();
  const params = useParams<ILoginPageParams>();

  const [name, setName] = useState('');
  const [roomCode, setRoomCode] = useState(params.roomCode ?? '');

  const attemptToJoinRoom = async () => {
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
        OR create a new game
        <LinkAnchor data-testid="newGame" href="/create">
          here
        </LinkAnchor>
      </Text>
    </Box>
  );
};

export { LoginPage };
