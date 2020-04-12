import { CanvasAction } from '@full-circle/shared/lib/canvas';
import { Heading } from 'grommet';
import React, { FunctionComponent } from 'react';
import { ViewCanvas } from 'src/components/Canvas/ViewCanvas';
import { Card } from 'src/components/Card/Card';

interface IDrawingSubmittedCardProps {
  canvasActions: CanvasAction[];
}

const DrawingSubmittedCard: FunctionComponent<IDrawingSubmittedCardProps> = ({
  canvasActions,
}) => {
  return (
    <Card>
      <Heading level="2" textAlign="center">
        Submitted!
      </Heading>
      <ViewCanvas canvasActions={canvasActions} />
    </Card>
  );
};

export { DrawingSubmittedCard };
