import 'styled-components/macro';

import { Box, Heading, Paragraph } from 'grommet';
import React, { FunctionComponent } from 'react';
import { AllPlayersCircle } from 'src/components/AllPlayersCircle';
import { LinkButton } from 'src/components/Link/LinkButton';

interface IDrawProps {
  playerBoxes: {};
}
/* 
TODO
Players who have submitted,
their box should be highlighted
*/
const IngameDraw: FunctionComponent<IDrawProps> = ({ playerBoxes }) => {
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
        <Heading>Drawing Phase</Heading>
        <Paragraph>It's time to d-d-d-d-d-d-d-draw</Paragraph>
        <Paragraph>Timer : </Paragraph>
        <LinkButton alignSelf="center" label="Go to Home" href="/home" />
      </Box>
    </Box>
  );
};

export { IngameDraw };
