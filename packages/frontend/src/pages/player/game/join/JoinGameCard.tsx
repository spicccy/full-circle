import { formatUsername } from '@full-circle/shared/lib/helpers';
import { FormField, Heading, TextInput } from 'grommet';
import React, {
  ChangeEventHandler,
  FormEventHandler,
  FunctionComponent,
  useState,
} from 'react';
import { LoadingButton } from 'src/components/Button/LoadingButton';
import { Card } from 'src/components/Card/Card';

import { CloseButton } from '../components/CloseButton';

interface IJoinGameCardProps {
  onJoinGame(name: string): void;
  roomCode?: string;
  isLoading: boolean;
}

const JoinGameCard: FunctionComponent<IJoinGameCardProps> = ({
  onJoinGame,
  roomCode,
  isLoading,
}) => {
  const [username, setName] = useState('');

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setName(formatUsername(e.target.value));
  };

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    onJoinGame(username);
  };

  return (
    <Card pad="large">
      <CloseButton />
      <Heading textAlign="center" level="2">
        Room {roomCode}
      </Heading>
      <form onSubmit={handleSubmit}>
        <FormField label="Username">
          <TextInput
            disabled={isLoading}
            maxLength={12}
            required
            value={username}
            onChange={handleChange}
            data-testid="playerNameInput"
          />
        </FormField>
        <LoadingButton
          type="submit"
          label="Join"
          disabled={isLoading}
          loading={isLoading}
          data-testid="joinWithName"
        />
      </form>
    </Card>
  );
};

export { JoinGameCard };
