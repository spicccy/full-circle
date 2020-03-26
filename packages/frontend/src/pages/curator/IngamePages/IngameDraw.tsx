import { Box, Heading, Paragraph } from 'grommet';
import React, { FunctionComponent } from 'react';
import { LinkButton } from 'src/components/Link/LinkButton';
import { usePhaseTimer } from 'src/hooks/usePhaseTimer';

const IngameDraw: FunctionComponent = () => {
  const phaseTimer = usePhaseTimer();

  return (
    <Box flex align="center" justify="center">
      <Box width="medium" align="center">
        <Heading>Drawing Phase</Heading>
        <Box align="center">
          <Paragraph>It's time to d-d-d-d-d-d-d-draw</Paragraph>
          <Paragraph>Timer : {phaseTimer} </Paragraph>
        </Box>
        <LinkButton alignSelf="center" label="Go to Home" href="/home" />
      </Box>
    </Box>
  );
};

export { IngameDraw };
