import React, { FunctionComponent } from 'react';
import { Box, Heading, Paragraph } from 'grommet';
import { Navbar } from 'src/components/Navbar';

const Team: FunctionComponent = () => {
  return (
    <Box background="light-2" fill>
      <Navbar />
      <Box align="center" justify="start">
        <Box width="medium">
          <Heading>Team Members</Heading>
          <Box align="start">
            <Heading level="2" margin="none">
              Alexander Su
            </Heading>
            <Paragraph>I am wholesome</Paragraph>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export { Team };
