import 'styled-components/macro';

import { Box, Heading, Paragraph } from 'grommet';
import React, { FunctionComponent } from 'react';
import { CuratorTimer } from 'src/components/CuratorTimer';
import { LinkButton } from 'src/components/Link/LinkButton';
import { PlayerBackground } from 'src/components/PlayerBackground';

/* 
TODO
Players who have submitted,
their box should be highlighted
*/
const IngameDraw: FunctionComponent = () => {
  return (
    <Box css={{ position: 'relative' }} fill>
      <PlayerBackground />
      <Box flex align="center" justify="center">
        <Heading>Drawing Phase</Heading>
        <Paragraph>It's time to d-d-d-d-d-d-d-draw</Paragraph>
        <CuratorTimer />
        <LinkButton alignSelf="center" label="Go to Home" href="/create" />
      </Box>
    </Box>
  );
};

export { IngameDraw };
