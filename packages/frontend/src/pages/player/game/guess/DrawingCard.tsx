import { CanvasAction } from '@full-circle/shared/lib/canvas/interfaces';
import { Box, Heading } from 'grommet';
import React, { FunctionComponent } from 'react';
import { ViewCanvas } from 'src/components/Canvas/ViewCanvas';
import { Card } from 'src/components/Card/Card';

import { PhaseTimer } from '../components/Timer';

interface IDrawingCardProps {
  drawing: CanvasAction[];
  drawingBy: string;
}

const DrawingCard: FunctionComponent<IDrawingCardProps> = ({
  drawing = [],
  drawingBy,
}) => (
  <Card>
    <Box align="center">
      <Heading margin={{ bottom: 'none' }}>Guess!</Heading>
      <Heading level="3" margin="small" textAlign="center">
        {drawingBy}'s drawing
      </Heading>
    </Box>
    <PhaseTimer />
    <ViewCanvas canvasActions={drawing} />
  </Card>
);

export { DrawingCard };
