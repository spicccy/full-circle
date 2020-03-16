import React, { FunctionComponent, useState } from 'react';
import { Box, Heading, TextInput, Text, Button } from 'grommet';
import logo from '../images/fullcircle.png';

import 'styled-components/macro';
import { Link } from 'react-router-dom';

const LoginPage: FunctionComponent = () => {
  const [name, setName] = useState('');
  const [roomID, setRoomID] = useState('');

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
            <Button margin={{ top: 'large' }} size="large" label="JOIN" />
          </Box>
          <Box direction="row" justify="center" pad="small">
            <Link css={{ color: 'white', textDecoration: 'none' }} to="/create">
              OR create a game{' '}
              <span
                css={{
                  textDecoration: 'underline',
                  '&:hover': {
                    fontWeight: 'bolder',
                  },
                }}
              >
                here
              </span>
              .
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export { LoginPage };
