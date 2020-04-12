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
import { CanvasAction } from '@full-circle/shared/lib/canvas';

interface IGuessPage {
  drawing: CanvasAction[];
}

const GuessPage: FunctionComponent<IGuessPage> = ({ drawing }) => {
  const { room } = useRoom();

  const { addToast } = useToasts();
  const [guess, setGuess] = useState('');

  const handleSubmit = () => {
    room?.send(submitGuess(guess));
    addToast('Submitted Guess', { appearance: 'success' });
  };

  useRoomMessage((action) => {
    switch (action.type) {
      case getType(forceSubmit): {
        handleSubmit();
        return;
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
