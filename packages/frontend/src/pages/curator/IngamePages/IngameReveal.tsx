import 'styled-components/macro';

import { Box, Heading, Paragraph } from 'grommet';
import React, { FunctionComponent } from 'react';
import { AllPlayersCircle } from 'src/components/AllPlayersCircle';
import { LinkButton } from 'src/components/Link/LinkButton';

interface IRevealProps {
  playerBoxes: {};
}

const IngameReveal: FunctionComponent<IRevealProps> = ({ playerBoxes }) => {
  return (
    <Box css={{ position: 'relative' }} fill>
      <Box
        css={{ position: 'absolute', zIndex: -1 }}
        overflow="hidden"
        fill
        align="center"
        justify="center"
      >
        <AllPlayersCircle />
        {playerBoxes}
      </Box>
      <Box flex align="center" justify="center">
        <Heading>Thats a wrap, bois.</Heading>
        <Paragraph>
          Each player will be able to control their own viewing of their chain
        </Paragraph>
        <LinkButton alignSelf="center" label="Go to Home" href="/home" />
      </Box>
    </Box>
  );
};

export { IngameReveal };
