import React, { FunctionComponent } from 'react';
import { Canvas } from './components/Canvas/Canvas';
import { Grommet, Box, Heading } from 'grommet';
import { theme } from './styles/theme';
import { RoomProvider } from './contexts/RoomContext';
import { MainPage } from './pages/MainPage';

import 'styled-components/macro';

export const App: FunctionComponent = () => {
  return (
    <RoomProvider>
      <Grommet theme={theme} full>
        <Box fill>
          <Box flex align="center" justify="center">
            <Box width="medium">
              <Heading>spicccy.</Heading>
              <Canvas />
              <MainPage />
            </Box>
          </Box>
        </Box>
      </Grommet>
    </RoomProvider>
  );
};
