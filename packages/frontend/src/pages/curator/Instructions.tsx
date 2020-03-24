import React, { FunctionComponent } from 'react';
import { Box, Heading, Paragraph } from 'grommet';
import { Navbar } from 'src/components/Navbar';

const Instructions: FunctionComponent = () => {
  return (
    <Box background="light-2" fill>
      <Navbar />
      <Box align="center" justify="start">
        <Box width="medium" align="center">
          <Heading>How to Play</Heading>
          <Box align="center">
            <Paragraph>After creating a game..........</Paragraph>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export { Instructions };