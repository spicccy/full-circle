import { CanvasAction } from '@full-circle/shared/lib/canvas/interfaces';
import { Button } from 'grommet';
import React, { FunctionComponent, useState } from 'react';
import { Canvas } from 'src/components/Canvas/Canvas';
import { Card } from 'src/components/Card/Card';

interface ICanvasCardProps {
  onSubmitDrawing(canvasActions: CanvasAction[]): void;
}

const CanvasCard: FunctionComponent<ICanvasCardProps> = ({
  onSubmitDrawing,
}) => {
  const [canvasActions, setCanvasActions] = useState<CanvasAction[]>([]);

  const handleSubmit = () => {
    onSubmitDrawing(canvasActions);
  };

  return (
    <Card>
      <Canvas
        canvasActions={canvasActions}
        setCanvasActions={setCanvasActions}
      />
      <Button onClick={handleSubmit} label="Submit" />
    </Card>
  );
};

export { CanvasCard };
