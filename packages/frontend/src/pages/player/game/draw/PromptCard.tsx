import { Box, Heading } from 'grommet';
import React, { FunctionComponent } from 'react';
import { Card } from 'src/components/Card/Card';

import { PhaseTimer } from '../components/Timer';

interface IPromptCardProps {
  prompt?: string;
}

const PromptCard: FunctionComponent<IPromptCardProps> = ({ prompt }) => (
  <Card>
    <Box align="center">
      <Heading data-testhidden="true">Draw!</Heading>
      <Heading level="2" margin={{ top: 'none', bottom: 'large' }}>
        {prompt}
      </Heading>
    </Box>
    <PhaseTimer />
  </Card>
);

export { PromptCard };
