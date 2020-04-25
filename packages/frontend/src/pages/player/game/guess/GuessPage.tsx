import { submitGuess } from '@full-circle/shared/lib/actions/client';
import { CanvasAction } from '@full-circle/shared/lib/canvas';
import { Box, Heading } from 'grommet';
import React, { FunctionComponent, useState } from 'react';
import { Card } from 'src/components/Card/Card';
import { useRoom } from 'src/contexts/RoomContext';
import { useRoomHelpers } from 'src/hooks/useRoomHelpers';

import { Background } from '../components/Background';
import { DrawingCard } from './DrawingCard';
import { GuessCard } from './GuessCard';
import { GuessSubmittedCard } from './GuessSubmittedCard';

interface IGuessPage {
  drawing?: CanvasAction[];
}

const GuessPage: FunctionComponent<IGuessPage> = ({ drawing = [] }) => {
  const { room, syncedState } = useRoom();
  const { hasSubmitted } = useRoomHelpers();

  const [guess, setGuess] = useState('');

  const handleSubmit = () => {
    room?.send(submitGuess(guess));
  };

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
