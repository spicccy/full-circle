import { submitDrawing } from '@full-circle/shared/lib/actions/client';
import { CanvasAction } from '@full-circle/shared/lib/canvas/interfaces';
import { Room } from 'colyseus.js';
import { Box, Button, Heading, Text } from 'grommet';
import React, { FunctionComponent, useState } from 'react';
import { Canvas } from 'src/components/Canvas/Canvas';

const DrawPage: FunctionComponent<{ room: Room }> = ({ room }) => {
  const [canvasActions, setCanvasActions] = useState<CanvasAction[]>([]);
  const [prompt, setPrompt] = useState('GUESS1');

  const handleSubmit = () => {
    room.send(submitDrawing(canvasActions));
  };

  return (
    <Box fill align="center" justify="center" pad="medium">
      <Box width="medium">
        <Heading>Room {room.id}</Heading>
        <div>
          <Box
            margin={{ bottom: 'medium' }}
            justify="center"
            align="center"
            border="all"
            pad="medium"
          >
            <Text>Your prompt is: </Text>
            <Heading>{prompt}</Heading>
          </Box>
        </div>
        <Canvas
          canvasActions={canvasActions}
          setCanvasActions={setCanvasActions}
        />
        <Button onClick={handleSubmit} label="Submit" />
      </Box>
    </Box>
  );
};

export { DrawPage };
