import 'styled-components/macro';

import { Box, Heading, Image } from 'grommet';
import React, { FormEvent, FunctionComponent, useState } from 'react';
import { LoadingButton } from 'src/components/Button/LoadingButton';
import { Card } from 'src/components/Card/Card';
import { useLoader } from 'src/hooks/useLoader';
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
  attemptToJoinRoom(roomCode: string): Promise<unknown>;
}

const LoginCard: FunctionComponent<ILoginCardProps> = ({
  attemptToJoinRoom,
}) => {
  const [roomCode, setRoomCode] = useState('');
  const { isLoading, load } = useLoader();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await load(() => attemptToJoinRoom(roomCode));
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card pad="large">
        <Header />
        <RoomInput value={roomCode} onChange={setRoomCode} />
        <LoadingButton
          data-testid="joinRoom"
          loading={isLoading}
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
