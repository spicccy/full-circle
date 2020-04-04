import { submitGuess } from '@full-circle/shared/lib/actions/client';
import { CanvasAction } from '@full-circle/shared/lib/canvas';
import { Room } from 'colyseus.js';
import { Box } from 'grommet';
import React, { FunctionComponent } from 'react';

import { DrawingCard } from './DrawingCard';
import { GuessCard } from './GuessCard';

interface IGuessPageProps {
  room: Room;
  drawing: CanvasAction[];
  drawingBy: string;
}

const GuessPage: FunctionComponent<IGuessPageProps> = ({
  room,
  drawing,
  drawingBy,
}) => {
  const handleSubmit = (guess: string) => {
    room.send(submitGuess(guess));
  };

  return (
    <Box
      background="dark-1"
      flex
      height={{ min: '100vh' }}
      align="center"
      justify="center"
      pad="medium"
    >
      <Box width="medium" margin={{ bottom: 'medium' }}>
        <DrawingCard drawing={drawing} drawingBy={drawingBy} />
      </Box>
      <Box width="medium">
        <GuessCard onSubmitGuess={handleSubmit} />
      </Box>
    </Box>
  );
};

export { GuessPage };
