import { Box, Heading, Paragraph } from 'grommet';
import React, { FunctionComponent } from 'react';
import { LinkButton } from 'src/components/Link/LinkButton';

const IngameDraw: FunctionComponent = () => {
  return (
    <Box flex align="center" justify="center">
      <Box width="medium" align="center">
        <Heading>Drawing Phase</Heading>
        <Box align="center">
          <Paragraph>It's time to d-d-d-d-d-d-d-draw</Paragraph>
          <Paragraph>Timer : </Paragraph>
        </Box>
        <LinkButton alignSelf="center" label="Go to Home" href="/home" />
      </Box>
    </Box>
  );
};

export { IngameDraw };
