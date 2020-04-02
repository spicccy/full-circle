import 'styled-components/macro';

import { Box, Heading, Paragraph } from 'grommet';
import React, { FunctionComponent } from 'react';
import { AllPlayersCircle } from 'src/components/AllPlayersCircle';
import { LinkButton } from 'src/components/Link/LinkButton';

interface IGuessProps {
  playerBoxes: {};
  phaseTimer?: number;
}

const IngameGuess: FunctionComponent<IGuessProps> = ({
  playerBoxes,
  phaseTimer,
}) => {
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
      <Box background="light-2" fill>
        <Box flex align="center" justify="center">
          <Box width="medium" align="center">
            <Heading>Guessing Phase</Heading>
            <Box align="center">
              <Paragraph>It's time to g-g-g-g-g-g-g-guess</Paragraph>
              <Paragraph>Timer : {phaseTimer}</Paragraph>
            </Box>
            <LinkButton alignSelf="center" label="Go to Home" href="/home" />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export { IngameGuess };
