import React, { FunctionComponent } from 'react';
import { CanvasAction } from '@full-circle/shared/lib/canvas/interfaces';
import { submitGuess } from '@full-circle/shared/lib/actions/client';
import { Box } from 'grommet';
import { DrawingCard } from './DrawingCard';
import { GuessCard } from './GuessCard';
import { usePhaseTimer } from 'src/hooks/usePhaseTimer';
import { Room } from 'colyseus.js';

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
