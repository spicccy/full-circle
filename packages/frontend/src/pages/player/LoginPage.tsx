import React, { FunctionComponent, useState } from 'react';
import { Box, Heading, TextInput, Text, Button } from 'grommet';
import logo from 'src/images/fullcircle.png';

import 'styled-components/macro';
import { Link, useHistory } from 'react-router-dom';
import { useRoom } from 'src/contexts/RoomContext';

const LoginPage: FunctionComponent = () => {
  const [name, setName] = useState('');
  const [roomID, setRoomID] = useState('');

  const { joinRoomById } = useRoom();
  const history = useHistory();

  const attemptToJoinRoom = async () => {
    const joinedRoom = await joinRoomById(roomID);
    if (joinedRoom) {
      history.push('/play');
    } else {
      //TODO: implement precise error states
      alert('Failed to join room');
    }
  };

  return (
    <Box background="dark-1" fill>
      <Box flex align="center" justify="center">
        <Box width="medium">
          <Box background="light-1" pad="large">
            <Box
              direction="row"
              align="center"
              justify="center"
              margin={{ bottom: 'large' }}
            >
              <img alt="Full Circle" width={100} height={100} src={logo} />
              <Heading>Full Circle</Heading>
            </Box>

            <Box direction="row" align="center" margin={{ vertical: 'medium' }}>
              <Text
                style={{ fontWeight: 'bolder' }}
                size="large"
                margin={{ right: '8px' }}
              >
                Name
              </Text>
              <TextInput
                size="medium"
                id="username"
                onChange={event => {
                  setName(event.target.value);
                }}
                value={name}
              />
            </Box>
            <Box direction="row" align="center">
              <Text
                style={{ fontWeight: 'bolder' }}
                size="large"
                margin={{ right: '8px' }}
              >
                Room
              </Text>
              <TextInput
                size="medium"
                id="room-code"
                onChange={event => {
                  setRoomID(event.target.value);
                }}
                value={roomID}
              ></TextInput>
            </Box>
            <Button
              margin={{ top: 'large' }}
              size="large"
              label="JOIN"
              onClick={attemptToJoinRoom}
            />
          </Box>
          <div css={{ paddingTop: 8 }}>
            OR create a new game{' '}
            <Link css={{ color: 'white' }} to="/create">
              here
            </Link>
          </div>
        </Box>
      </Box>
    </Box>
  );
};

export { LoginPage };
