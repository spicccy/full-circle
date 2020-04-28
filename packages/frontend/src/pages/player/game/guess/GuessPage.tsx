import { submitGuess } from '@full-circle/shared/lib/actions/client';
import { forceSubmit } from '@full-circle/shared/lib/actions/server';
import { CanvasAction } from '@full-circle/shared/lib/canvas';
import { Box, Heading } from 'grommet';
import React, { FunctionComponent, useState } from 'react';
import { Card } from 'src/components/Card/Card';
import { useRoom } from 'src/contexts/RoomContext';
import { useRoomHelpers } from 'src/hooks/useRoomHelpers';
import { useRoomMessage } from 'src/hooks/useRoomListeners';
import { getType } from 'typesafe-actions';

import { Background } from '../components/Background';
import { DrawingCard } from './DrawingCard';
import { GuessCard } from './GuessCard';
import { GuessSubmittedCard } from './GuessSubmittedCard';

const parseDrawing = (data?: string): CanvasAction[] => {
  try {
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

const GuessPage: FunctionComponent = () => {
  const { sendAction, syncedState } = useRoom();
  const { hasSubmitted, playerData } = useRoomHelpers();

  const [guess, setGuess] = useState('');

  const drawing = parseDrawing(playerData?.roundData?.data ?? undefined);

  const handleSubmit = () => {
    if (!hasSubmitted) {
      sendAction(submitGuess(guess));
    }
  };

  useRoomMessage((action) => {
    switch (action.type) {
      case getType(forceSubmit): {
        handleSubmit();
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

    if (syncedState?.showBuffer) {
      return (
        <Box width="medium">
          <Card align="center" justify="center">
            <Heading>Moving on... Too bad</Heading>
          </Card>
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

  return <Background>{renderBody()}</Background>;
};

export { GuessPage };
