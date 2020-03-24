import React, { FunctionComponent } from 'react';
import { Box, Text } from 'grommet';
import { useHistory } from 'react-router-dom';
import { useRoom } from 'src/contexts/RoomContext';
import { LoginCard } from './LoginCard';
import { LinkAnchor } from 'src/components/Link/LinkAnchor';

const LoginPage: FunctionComponent = () => {
  const { joinRoomById } = useRoom();
  const history = useHistory();

  const attemptToJoinRoom = async (name: string, roomId: string) => {
    const options = {
      username: name,
    };

    const joinedRoom = await joinRoomById(roomId, options);

    if (joinedRoom) {
      history.push('/timertest');
    } else {
      //TODO: implement precise error states
      alert('Failed to join room');
    }
  };

  return (
    <Box background="dark-1" fill align="center" justify="center" pad="medium">
      <Box width="medium" margin={{ bottom: 'medium' }}>
        <LoginCard attemptToJoinRoom={attemptToJoinRoom} />
      </Box>
      <Text>
        OR create a new game <LinkAnchor href="/home">here</LinkAnchor>
      </Text>
    </Box>
  );
};

export { LoginPage };
