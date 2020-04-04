import 'styled-components/macro';

import { Box, Heading, Paragraph } from 'grommet';
import React, { FunctionComponent } from 'react';
import { CuratorTimer } from 'src/components/CuratorTimer';
import { LinkButton } from 'src/components/Link/LinkButton';
import { PlayerBackground } from 'src/components/PlayerBackground';

const IngameGuess: FunctionComponent = () => {
  return (
    <Box css={{ position: 'relative' }} fill>
      <PlayerBackground />
      <Box background="light-2" fill>
        <Box flex align="center" justify="center">
          <Box width="medium" align="center">
            <Heading>Guessing Phase</Heading>
            <Box align="center">
              <Paragraph>It's time to g-g-g-g-g-g-g-guess</Paragraph>
              <CuratorTimer />
            </Box>
            <LinkButton alignSelf="center" label="Go to Home" href="/" />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export { IngameGuess };
