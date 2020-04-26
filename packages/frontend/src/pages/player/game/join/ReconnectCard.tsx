import { IPlayer } from '@full-circle/shared/lib/roomState';
import { Box, Heading } from 'grommet';
import { Text } from 'grommet';
import React, { FunctionComponent } from 'react';
import { LoadingButton } from 'src/components/Button/LoadingButton';
import { Card } from 'src/components/Card/Card';

import { CloseButton } from '../components/CloseButton';

interface IReconnectCardProps {
  disconnectedPlayers: IPlayer[];
  isLoading: boolean;
  roomCode?: string;
  onReconnect(clientId: string): void;
}

const ReconnectCard: FunctionComponent<IReconnectCardProps> = ({
  disconnectedPlayers,
  isLoading,
  roomCode,
  onReconnect,
}) => {
  return (
    <Card pad="large">
      <CloseButton />
      <Heading textAlign="center" level="2">
        Room {roomCode}
      </Heading>
      <Heading textAlign="center" level="4">
        Disconnected players:
      </Heading>
      {disconnectedPlayers.map((p) => (
        <Box direction="row" justify="around" key={p.id}>
          <Text>{p.username}</Text>
          <LoadingButton
            disabled={isLoading}
            loading={isLoading}
            label="Reconnect"
            onClick={() => onReconnect(p.id)}
          />
        </Box>
      ))}
    </Card>
  );
};

export { ReconnectCard };
