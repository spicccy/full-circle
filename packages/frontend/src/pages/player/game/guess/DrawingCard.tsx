import { CanvasAction } from '@full-circle/shared/lib/canvas';
import { Box, Heading } from 'grommet';
import React, { FunctionComponent } from 'react';
import { ViewCanvas } from 'src/components/Canvas/ViewCanvas';
import { Card } from 'src/components/Card/Card';

import { PhaseTimer } from '../components/Timer';

interface IDrawingCardProps {
  drawing: CanvasAction[];
}

const DrawingCard: FunctionComponent<IDrawingCardProps> = ({
  drawing = [],
}) => (
  <Card>
    <Box align="center">
      <Heading margin={{ bottom: 'none' }}>Guess!</Heading>
    </Box>
    <PhaseTimer />
    <ViewCanvas canvasActions={drawing} />
  </Card>
);

export { DrawingCard };
