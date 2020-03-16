import React, { FunctionComponent, useState } from 'react';
import { Canvas } from 'src/components/Canvas/Canvas';
import { CanvasAction } from '@full-circle/shared/lib/canvas/interfaces';
import { submitDrawing } from '@full-circle/shared/lib/actions/client';
import { Box, Button } from 'grommet';
import { Room } from 'colyseus.js';

const DrawPage: FunctionComponent<{ room: Room }> = ({ room }) => {
  const [canvasActions, setCanvasActions] = useState<CanvasAction[]>([]);

  const handleSubmit = () => {
    room.send(submitDrawing(canvasActions));
  };

  return (
    <Box>
      <Canvas
        canvasActions={canvasActions}
        setCanvasActions={setCanvasActions}
      />
      <Button onClick={handleSubmit} label="Submit" />
    </Box>
  );
};

export { DrawPage };
