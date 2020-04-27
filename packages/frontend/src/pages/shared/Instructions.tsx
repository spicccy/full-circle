import 'styled-components/macro';

import { Colour } from '@full-circle/shared/lib/canvas';
import { Box, Heading, Text } from 'grommet';
import React, { FunctionComponent } from 'react';
import { Card } from 'src/components/Card/Card';
import { Navbar } from 'src/components/Navbar';
import { RenderChain } from 'src/components/RenderChain';

import { mockChain, mockPlayersMap } from '../curator/IngamePages/mockChain';

const Instructions: FunctionComponent = () => {
  return (
    <Box flex>
      <Navbar />
      <Box flex background="dark-1" align="center" justify="center" pad="large">
        <Box flex width="large" gap="medium">
          <Heading level={2}>How the Game Works</Heading>

          <Box gap="small">
            <Text size="large">Draw the prompt you're given</Text>
            <Card>
              <RenderChain chain={mockChain(2)} playersMap={mockPlayersMap} />
            </Card>
          </Box>

          <Box gap="small">
            <Text size="large">
              You'll see someone else's drawing and guess what they drew
            </Text>
            <Card>
              <RenderChain chain={mockChain(3)} playersMap={mockPlayersMap} />
            </Card>
          </Box>

          <Box gap="small">
            <Text size="large">Your guess becomes a new prompt</Text>
            <Card>
              <RenderChain chain={mockChain(4)} playersMap={mockPlayersMap} />
            </Card>
          </Box>

          <Box gap="small">
            <Text size="large">
              Repeat until you've all gone{' '}
              <span css={{ color: Colour.ORANGE }}>Full Circle!</span>
            </Text>
            <Card>
              <RenderChain chain={mockChain(5)} playersMap={mockPlayersMap} />
            </Card>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export { Instructions };
