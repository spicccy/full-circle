import React, { FunctionComponent, useState } from 'react';
import { Canvas } from 'src/components/Canvas/Canvas';
import { CanvasAction } from '@full-circle/shared/lib/canvas/interfaces';
import { submitDrawing } from '@full-circle/shared/lib/actions/client';
import { Box, Button, Heading } from 'grommet';
import { Room } from 'colyseus.js';
import { useRoomMessage } from 'src/hooks/useRoomMessage';
import { getType } from 'typesafe-actions';
import { displayDrawing, displayPrompt } from '@full-circle/shared/lib/actions/server';
import PlayerGuess from 'src/components/PlayerGuess';

const DrawPage: FunctionComponent<{ room: Room }> = ({ room }) => {
  const [canvasActions, setCanvasActions] = useState<CanvasAction[]>([]);
  
  useRoomMessage(message => {
    switch (message.type) {
      case getType(displayDrawing): {
        setCanvasActions(message.payload);
      }
      case getType(displayPrompt):{
        //display new prompt
      }
    }
  });

  const handleSubmit = () => {
    room.send(submitDrawing(canvasActions));
  };

  return (
    <Box>
      <Heading>Room {room.id}</Heading>
      <Heading>Prompt: <PlayerGuess/></Heading>
      <Canvas
        canvasActions={canvasActions}
        setCanvasActions={setCanvasActions}
      />
      <Button onClick={handleSubmit} label="Submit" />
    </Box>
  );
};

export { DrawPage };
