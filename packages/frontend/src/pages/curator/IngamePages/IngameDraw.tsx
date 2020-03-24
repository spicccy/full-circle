import React, { FunctionComponent } from 'react';
import { Box, Heading, Paragraph } from 'grommet';
import { LinkButton } from 'src/components/Link/LinkButton';

const IngameDraw: FunctionComponent = () => {
  return (
    <Box background="light-2" fill>
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
    </Box>
  );
};

export { IngameDraw };
