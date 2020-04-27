import 'styled-components/macro';

import { Box, FormField, Heading, Image, TextInput } from 'grommet';
import React, {
  ChangeEventHandler,
  FormEvent,
  FunctionComponent,
  useState,
} from 'react';
import { LoadingButton } from 'src/components/Button/LoadingButton';
import { Card } from 'src/components/Card/Card';
import { useLoader } from 'src/hooks/useLoader';
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
  attemptToJoinRoom(roomCode: string): Promise<unknown>;
}

const LoginCard: FunctionComponent<ILoginCardProps> = ({
  attemptToJoinRoom,
}) => {
  const [roomCode, setRoomCode] = useState('');
  const { isLoading, load } = useLoader();

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const stripped = e.target.value.replace(/[^0-9]/gi, '').substring(0, 4);
    setRoomCode(stripped);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await load(() => attemptToJoinRoom(roomCode));
  };

  return (
    <Card pad="large">
      <Header />
      <form onSubmit={handleSubmit}>
        <FormField label="Room Code">
          <TextInput
            size="large"
            disabled={isLoading}
            value={roomCode}
            data-testid="roomCodeInput"
            type="tel"
            pattern="[0-9]*"
            required
            maxLength={4}
            autoComplete="off"
            onChange={handleChange}
          />
        </FormField>
        <LoadingButton
          data-testid="joinRoom"
          loading={isLoading}
          type="submit"
          size="large"
          alignSelf="center"
          label="JOIN"
        />
      </form>
    </Card>
  );
};

export { LoginCard };
