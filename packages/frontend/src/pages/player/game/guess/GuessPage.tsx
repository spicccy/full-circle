import React, { FunctionComponent } from 'react';
import { CanvasAction } from '@full-circle/shared/lib/canvas/interfaces';
import { Box } from 'grommet';
import { DrawingCard } from './DrawingCard';
import { GuessCard } from './GuessCard';
import { usePhaseTimer } from 'src/hooks/usePhaseTimer';

interface IGuessPageProps {
  receivedDrawing?: CanvasAction[];
  receivedArtist?: string;
  onSubmitGuess(guess: string): void;
}

const GuessPage: FunctionComponent<IGuessPageProps> = ({
  receivedArtist,
  receivedDrawing,
  onSubmitGuess,
}) => {
  const timer = usePhaseTimer();

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
        <GuessCard onSubmitGuess={onSubmitGuess} />
      </Box>
    </Box>
  );
};

export { GuessPage };
