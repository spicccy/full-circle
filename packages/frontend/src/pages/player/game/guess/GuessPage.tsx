import { submitGuess } from '@full-circle/shared/lib/actions/client';
import { Box } from 'grommet';
import React, { FunctionComponent } from 'react';
import { useRoom } from 'src/contexts/RoomContext';

import { DrawingCard } from './DrawingCard';
import { GuessCard } from './GuessCard';

const GuessPage: FunctionComponent = () => {
  const { room, syncedState } = useRoom();

  const id = room?.sessionId;
  const roundData = syncedState?.roundData;
  const drawingString = roundData?.find((link) => link.id === id)?.data;
  const drawing = drawingString ? JSON.parse(drawingString) : [];

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
        <DrawingCard drawing={drawing} />
      </Box>
      <Box width="medium">
        <GuessCard onSubmitGuess={handleSubmit} />
      </Box>
    </Box>
  );
};

export { GuessPage };
