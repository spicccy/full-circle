import { submitGuess } from '@full-circle/shared/lib/actions/client';
import { forceSubmit } from '@full-circle/shared/lib/actions/server';
import { Box } from 'grommet';
import React, { FunctionComponent, useState } from 'react';
import { useToasts } from 'react-toast-notifications';
import { useRoom } from 'src/contexts/RoomContext';
import { useRoomMessage } from 'src/hooks/useRoomListeners';
import { getType } from 'typesafe-actions';

import { DrawingCard } from './DrawingCard';
import { GuessCard } from './GuessCard';

const GuessPage: FunctionComponent = () => {
  const { room, syncedState } = useRoom();

  const { addToast } = useToasts();
  const [guess, setGuess] = useState('');

  const id = room?.sessionId;
  const roundData = syncedState?.roundData;
  const drawingString = roundData?.find((link) => link.id === id)?.data;
  const drawing = drawingString ? JSON.parse(drawingString) : [];

  const handleSubmit = () => {
    room?.send(submitGuess(guess));
    addToast('Submitted Guess', { appearance: 'success' });
  };

  useRoomMessage((action) => {
    switch (action.type) {
      case getType(forceSubmit): {
        handleSubmit();
      }
    }
  });

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
        <GuessCard
          guess={guess}
          setGuess={setGuess}
          onSubmitGuess={handleSubmit}
        />
      </Box>
    </Box>
  );
};

export { GuessPage };
