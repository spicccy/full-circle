import 'styled-components/macro';

import { Box, Heading, Paragraph } from 'grommet';
import React, { FunctionComponent } from 'react';
import { LinkButton } from 'src/components/Link/LinkButton';
import { PlayerBackground } from 'src/components/PlayerBackground';

const IngameReveal: FunctionComponent = () => {
  return (
    <Box css={{ position: 'relative' }} fill>
      <PlayerBackground />
      <Box flex align="center" justify="center">
        <Heading>Thats a wrap, bois.</Heading>
        <Paragraph>
          Each player will be able to control their own viewing of their chain
        </Paragraph>
        <LinkButton alignSelf="center" label="Go to Home" href="/" />
      </Box>
    </Box>
  );
};

export { IngameReveal };
