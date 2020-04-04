import { submitGuess } from '@full-circle/shared/lib/actions/client';
import { CanvasAction } from '@full-circle/shared/lib/canvas';
import { Box } from 'grommet';
import React, { FunctionComponent } from 'react';
import { useRoom } from 'src/contexts/RoomContext';

import { DrawingCard } from './DrawingCard';
import { GuessCard } from './GuessCard';

interface IGuessPageProps {
  drawing: CanvasAction[];
  drawingBy: string;
}

const GuessPage: FunctionComponent<IGuessPageProps> = ({
  drawing,
  drawingBy,
}) => {
  const { room } = useRoom();

  const handleSubmit = (guess: string) => {
    room?.send(submitGuess(guess));
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
