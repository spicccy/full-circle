import { Box, Text } from 'grommet';
import React, { FunctionComponent, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { LinkAnchor } from 'src/components/Link/LinkAnchor';
import { useRoom } from 'src/contexts/RoomContext';

import { LoginCard } from './LoginCard';

interface ILoginPageParams {
  roomCode?: string;
}

const LoginPage: FunctionComponent = () => {
  const { joinRoomByCode } = useRoom();
  const history = useHistory();
  const params = useParams<ILoginPageParams>();

  const [name, setName] = useState('');
  const [roomCode, setRoomCode] = useState(params.roomCode ?? '');

  const attemptToJoinRoom = async () => {
    const options = {
      username: name,
    };

    const joinedRoom = await joinRoomByCode(roomCode, options);

    if (joinedRoom) {
      history.push('/play');
    } else {
      //TODO: implement precise error states
      alert('Failed to join room');
    }
  };

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
        OR create a new game <LinkAnchor href="/create">here</LinkAnchor>
      </Text>
    </Box>
  );
};

export { LoginPage };
