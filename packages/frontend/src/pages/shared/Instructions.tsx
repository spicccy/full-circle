import 'styled-components/macro';

import { Colour } from '@full-circle/shared/lib/canvas';
import { Box, Heading } from 'grommet';
import React, { FunctionComponent } from 'react';
import { Card } from 'src/components/Card/Card';
import { Navbar } from 'src/components/Navbar';
import { RenderChain } from 'src/components/RenderChain';

import { mockChain } from '../curator/IngamePages/mockChain';

const Instructions: FunctionComponent = () => {
  return (
    <Box fill flex>
      <Navbar />
      <Box background="dark-1" flex align="center" justify="center">
        <Box flex width="large" pad="medium">
          <Heading level={2}>How the Game Works</Heading>

          <Heading level={4}>Draw the prompt you're given</Heading>
          <Card>
            <RenderChain chain={mockChain(2)}></RenderChain>
          </Card>
          <Heading level={4}>
            You'll see someone else's drawing and guess what they drew
          </Heading>
          <Card>
            <RenderChain chain={mockChain(3)}></RenderChain>
          </Card>
          <Heading level={4}>Your guess becomes a new prompt</Heading>
          <Card>
            <RenderChain chain={mockChain(4)}></RenderChain>
          </Card>
          <Heading level={4}>
            Repeat until you've all gone{' '}
            <span css={{ color: Colour.ORANGE }}>Full Circle!</span>
          </Heading>
          <Card>
            <RenderChain chain={mockChain(5)}></RenderChain>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export { Instructions };
