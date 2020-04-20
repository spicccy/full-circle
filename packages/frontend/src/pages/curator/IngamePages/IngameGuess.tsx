import 'styled-components/macro';

import { Box, Heading, Paragraph } from 'grommet';
import React, { FunctionComponent } from 'react';
import { CuratorTimer } from 'src/components/CuratorTimer';
import { LinkButton } from 'src/components/Link/LinkButton';
import { useRoom } from 'src/contexts/RoomContext';

const IngameGuess: FunctionComponent = () => {
  const { syncedState } = useRoom();
  let title = <Heading>Guessing Phase</Heading>;
  let text = <Paragraph>It's time to g-g-g-g-g-g-g-guess</Paragraph>;
  if (syncedState?.showBuffer) {
    title = <Heading> Transitioning </Heading>;
    text = <Paragraph>We will begin the next stage shortly.</Paragraph>;
  }
  return (
    <Box css={{ position: 'relative' }} flex>
      <Box flex align="center" justify="center">
        {title}
        {text}
        <CuratorTimer />
        <LinkButton alignSelf="center" label="Go to Home" href="/create" />
      </Box>
    </Box>
  );
};

export { IngameGuess };
