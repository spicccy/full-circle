import { objectValues } from '@full-circle/shared/lib/helpers';
import { Box, Heading } from 'grommet';
import React, { FunctionComponent } from 'react';
import { Card } from 'src/components/Card/Card';
import { LinkButton } from 'src/components/Link/LinkButton';
import { Scoreboard } from 'src/components/Scoreboard';
import { useRoom } from 'src/contexts/RoomContext';

import { Background } from '../components/Background';

const EndPage: FunctionComponent = () => {
  const { leaveRoom, syncedState } = useRoom();
  if (!syncedState) {
    return null;
  }

  const players = objectValues(syncedState.playerManager.playerMap);

  return (
    <Background>
      <Box width="medium">
        <Card pad="medium">
          <Heading level="2" textAlign="center">
            GG!
          </Heading>
          <Scoreboard players={players} />
          <LinkButton label="Go home" href="/" onClick={leaveRoom} />
        </Card>
      </Box>
    </Background>
  );
};

export { EndPage };
