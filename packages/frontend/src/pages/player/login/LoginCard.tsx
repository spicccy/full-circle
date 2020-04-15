import 'styled-components/macro';

import { Colour } from '@full-circle/shared/lib/canvas';
import { Box, Heading, Image, Text, TextInput } from 'grommet';
import React, { FormEvent, FunctionComponent, useState } from 'react';
import { LoadingButton } from 'src/components/Button/LoadingButton';
import { Card } from 'src/components/Card/Card';
import logo from 'src/images/fullcircle.png';

import { RoomInput } from './RoomInput';

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
  usernameError?: boolean;
  roomCodeError?: boolean;
}

const LoginCard: FunctionComponent<ILoginCardProps> = ({
  name,
  roomCode,
  setName,
  setRoomCode,
  attemptToJoinRoom,
  usernameError,
  roomCodeError,
}) => {
  const handleSubmit = async (e: FormEvent) => {
    setLoading(true);
    e.preventDefault();
    await attemptToJoinRoom();
    setLoading(false);
  };

  const [loading, setLoading] = useState(false);
  const error = usernameError || roomCodeError;

  return (
    <form onSubmit={handleSubmit}>
      <Card
        border={
          error
            ? {
                color: Colour.RED,
                size: 'medium',
                style: 'solid',
                side: 'all',
              }
            : undefined
        }
        pad="large"
      >
        <Header />
        <Box direction="row" align="center" margin={{ bottom: 'medium' }}>
          <Text
            size="xlarge"
            margin={{ right: 'small' }}
            color={usernameError ? Colour.RED : undefined}
          >
            Name:
          </Text>
          <TextInput
            size="medium"
            id="username"
            data-testid="playerNameInput"
            required
            maxLength={12}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Box>
        <RoomInput value={roomCode} onChange={setRoomCode} />
        <LoadingButton
          data-testid="joinRoom"
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
