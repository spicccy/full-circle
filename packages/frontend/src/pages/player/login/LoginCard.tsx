import 'styled-components/macro';

import { Box, Heading, Image, Text, TextInput } from 'grommet';
import React, { FormEvent, FunctionComponent, useState } from 'react';
import { LoadingButton } from 'src/components/Button/LoadingButton';
import { Card } from 'src/components/Card/Card';
import logo from 'src/images/fullcircle.png';

const Header: FunctionComponent = () => (
  <Box direction="row" align="center" justify="center">
    <Image
      a11yTitle="Full Circle"
      width={100}
      height={100}
      margin={{ right: 'small' }}
      src={logo}
    />
    <Heading css={{ width: 'min-content' }} responsive={false}>
      Full Circle
    </Heading>
  </Box>
);

interface ILoginCardProps {
  name: string;
  roomCode: string;
  setName(name: string): void;
  setRoomCode(roomCode: string): void;
  attemptToJoinRoom(): void;
}

const LoginCard: FunctionComponent<ILoginCardProps> = ({
  name,
  roomCode,
  setName,
  setRoomCode,
  attemptToJoinRoom,
}) => {
  const handleSubmit = (e: FormEvent) => {
    setLoading(true);
    e.preventDefault();
    attemptToJoinRoom();
    setLoading(false);
  };

  const [loading, setLoading] = useState(false);

  return (
    <form onSubmit={handleSubmit}>
      <Card pad="large">
        <Header />
        <Box direction="row" align="center" margin={{ bottom: 'medium' }}>
          <Text size="xlarge" margin={{ right: 'small' }}>
            Name:
          </Text>
          <TextInput
            size="medium"
            id="username"
            required
            maxLength={12}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Box>
        <Box direction="row" align="center" margin={{ bottom: 'medium' }}>
          <Text size="xlarge" margin={{ right: 'small' }}>
            Room:
          </Text>
          <TextInput
            size="medium"
            id="roomCode"
            required
            maxLength={4}
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
          />
        </Box>
        <LoadingButton
          loading={loading}
          type="submit"
          size="large"
          alignSelf="center"
          label="JOIN"
        />
      </Card>
    </form>
  );
};

export { LoginCard };
