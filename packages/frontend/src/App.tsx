import React, { FunctionComponent } from 'react';
import { Canvas } from './components/Canvas/Canvas';
import { Grommet, Box, Heading, Button } from 'grommet';
import { theme } from './styles/theme';

import 'styled-components/macro';

export const App: FunctionComponent = () => {
  return (
    <Grommet theme={theme} full>
      <Box fill>
        <Box flex align="center" justify="center">
          <Box width="medium">
            <Canvas />
            <Heading>spicccy.</Heading>
            <Button
              label="play"
              css={{
                backgroundColor: 'yellow',
              }}
            />
          </Box>
        </Box>
      </Box>
    </Grommet>
  );
};
