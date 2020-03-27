import { submitGuess } from '@full-circle/shared/lib/actions/client';
import { CanvasAction } from '@full-circle/shared/lib/canvas/interfaces';
import { Room } from 'colyseus.js';
import { Box } from 'grommet';
import React, { FunctionComponent } from 'react';
import { usePhaseTimer } from 'src/hooks/usePhaseTimer';

import { DrawingCard } from './DrawingCard';
import { GuessCard } from './GuessCard';

interface IGuessPageProps {
  room: Room;
  receivedDrawing?: CanvasAction[];
  receivedArtist?: string;
}

const GuessPage: FunctionComponent<IGuessPageProps> = ({
  room,
  receivedArtist,
  receivedDrawing,
}) => {
  const timer = usePhaseTimer();

  const handleSubmit = (guess: string) => {
    room.send(submitGuess(guess));
  };

  return (
    <Box background="dark-1" fill align="center" justify="center" pad="medium">
      <Box width="medium" margin={{ bottom: 'medium' }}>
        <DrawingCard
          receivedArtist={receivedArtist}
          receivedDrawing={receivedDrawing}
          timer={timer}
        />
      </Box>
      <Box width="medium">
        <GuessCard onSubmitGuess={handleSubmit} />
      </Box>
    </Box>
  );
};

export { GuessPage };
