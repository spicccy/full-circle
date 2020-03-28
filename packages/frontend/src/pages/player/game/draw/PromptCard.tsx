import { Box, Heading } from 'grommet';
import React, { FunctionComponent } from 'react';
import { Card } from 'src/components/Card/Card';

import { PhaseTimer } from '../components/Timer';

interface IPromptCardProps {
  prompt?: string;
  promptBy?: string;
}

const PromptCard: FunctionComponent<IPromptCardProps> = ({
  prompt,
  promptBy,
}) => (
  <Card>
    <Box align="center">
      <Heading>Draw!</Heading>
      <Heading level="3" margin="none" textAlign="center">
        {promptBy ? `${promptBy}'s prompt` : 'Your prompt is'}
      </Heading>
      <Heading level="2" margin={{ top: 'none', bottom: 'large' }}>
        {prompt}
      </Heading>
    </Box>
    <PhaseTimer />
  </Card>
);

export { PromptCard };
