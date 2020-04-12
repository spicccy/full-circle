import { submitGuess } from '@full-circle/shared/lib/actions/client';
import { forceSubmit } from '@full-circle/shared/lib/actions/server';
import { CanvasAction } from '@full-circle/shared/lib/canvas';
import { Box } from 'grommet';
import React, { FunctionComponent, useState } from 'react';
import { useRoom } from 'src/contexts/RoomContext';
import { useRoomHelpers } from 'src/hooks/useRoomHelpers';
import { useRoomMessage } from 'src/hooks/useRoomListeners';
import { getType } from 'typesafe-actions';

import { DrawingCard } from './DrawingCard';
import { GuessCard } from './GuessCard';
import { GuessSubmittedCard } from './GuessSubmittedCard';

interface IGuessPage {
  drawing: CanvasAction[];
}

const GuessPage: FunctionComponent<IGuessPage> = ({ drawing }) => {
  const { room } = useRoom();
  const { hasSubmitted } = useRoomHelpers();

  const [guess, setGuess] = useState('');

  const handleSubmit = () => {
    room?.send(submitGuess(guess));
  };

  useRoomMessage((action) => {
    switch (action.type) {
      case getType(forceSubmit): {
        handleSubmit();
        return;
      }
    }
  });

  const renderBody = () => {
    if (hasSubmitted) {
      return (
        <Box width="medium">
          <GuessSubmittedCard guess={guess} />
        </Box>
      );
    }

    return (
      <>
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
      </>
    );
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
      {renderBody()}
    </Box>
  );
};

export { GuessPage };
