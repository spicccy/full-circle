import React, { FunctionComponent } from 'react';
import { Box, Heading, Button, Paragraph } from 'grommet';
import { useHistory } from 'react-router-dom';

const IngameDraw: FunctionComponent = () => {
  const history = useHistory();

  return (
    <Box background="light-2" fill>
      <Box flex align="center" justify="center">
        <Box width="medium" align="center">
          <Heading>Drawing Phase</Heading>
          <Box align="center">
            <Paragraph>It's time to d-d-d-d-d-d-d-draw</Paragraph>
            <Paragraph>Timer : </Paragraph>
          </Box>
          <Button
            alignSelf="center"
            label="Go to Home"
            onClick={async () => {
              history.push('/home');
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export { IngameDraw };
