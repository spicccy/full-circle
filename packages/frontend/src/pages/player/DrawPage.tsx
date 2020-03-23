import React, { FunctionComponent, useState } from 'react';
import { Canvas } from 'src/components/Canvas/Canvas';
import { CanvasAction } from '@full-circle/shared/lib/canvas/interfaces';
import { submitDrawing } from '@full-circle/shared/lib/actions/client';
import { Box, Button, Heading } from 'grommet';
import { Room } from 'colyseus.js';
import { useRoomMessage } from 'src/hooks/useRoomMessage';
import { getType } from 'typesafe-actions';
import { displayDrawing } from '@full-circle/shared/lib/actions/server';
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
} from '@full-circle/shared/lib/canvas/constants';

const DrawPage: FunctionComponent<{ room: Room }> = ({ room }) => {
  const [canvasActions, setCanvasActions] = useState<CanvasAction[]>([]);

  useRoomMessage(message => {
    switch (message.type) {
      case getType(displayDrawing): {
        setCanvasActions(message.payload);
      }
    }
  });

  const handleSubmit = () => {
    room.send(submitDrawing(canvasActions));
  };

  return (
    <Box>
      <Heading>Room {room.id}</Heading>
      <Canvas
        height={CANVAS_HEIGHT}
        width={CANVAS_WIDTH}
        canvasActions={canvasActions}
        setCanvasActions={setCanvasActions}
      />
      <Button onClick={handleSubmit} label="Submit" />
    </Box>
  );
};

export { DrawPage };
