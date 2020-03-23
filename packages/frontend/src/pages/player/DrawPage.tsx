import React, { FunctionComponent, useState } from 'react';
import { Canvas } from 'src/components/Canvas/Canvas';
import { CanvasAction } from '@full-circle/shared/lib/canvas/interfaces';
import { submitDrawing } from '@full-circle/shared/lib/actions/client';
import { Box, Button, Heading, Text } from 'grommet';
import { Room } from 'colyseus.js';
import { useRoomMessage } from 'src/hooks/useRoomMessage';
import { getType } from 'typesafe-actions';
import { displayDrawing } from '@full-circle/shared/lib/actions/server';

const DrawPage: FunctionComponent<{ room: Room }> = ({ room }) => {
  const [canvasActions, setCanvasActions] = useState<CanvasAction[]>([]);
  const [value, setValue] = useState('GUESS1');

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
      <div>
        <Box
          margin={{ bottom: 'medium' }}
          justify="center"
          align="center"
          border="all"
          pad="medium"
        >
          <Text id="prompt text">Your prompt is: </Text>
          <Heading>{value}</Heading>
        </Box>
      </div>
      <Canvas
        canvasActions={canvasActions}
        setCanvasActions={setCanvasActions}
      />
      <Button onClick={handleSubmit} label="Submit" />
    </Box>
  );
};

export { DrawPage };
