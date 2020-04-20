import 'styled-components/macro';

import { Box, Heading, Paragraph } from 'grommet';
import React, { FunctionComponent } from 'react';
import { CuratorBuffer } from 'src/components/CuratorBuffer';
import { CuratorTimer } from 'src/components/CuratorTimer';
import { LinkButton } from 'src/components/Link/LinkButton';
import { useRoom } from 'src/contexts/RoomContext';

const IngameGuess: FunctionComponent = () => {
  const { syncedState } = useRoom();

  if (syncedState?.showBuffer) {
    return <CuratorBuffer />;
  }
  return (
    <Box flex align="center" justify="center">
      <Heading>Guessing Phase</Heading>
      <Paragraph>It's time to g-g-g-g-g-g-g-guess</Paragraph>
      <CuratorTimer />
      <LinkButton alignSelf="center" label="Go to Home" href="/create" />
    </Box>
  );
};

export { IngameGuess };
