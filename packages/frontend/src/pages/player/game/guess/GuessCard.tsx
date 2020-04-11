import 'styled-components/macro';

import { Box, TextInput } from 'grommet';
import React, { FunctionComponent } from 'react';
import { Card } from 'src/components/Card/Card';

import { BorderBottom } from '../components/BorderBottom';
import { SubmitButton } from '../components/SubmitButton';

interface IGuessCardProps {
  guess: string;
  setGuess(guess: string): void;
  onSubmitGuess(): void;
}

const GuessCard: FunctionComponent<IGuessCardProps> = ({
  guess,
  setGuess,
  onSubmitGuess,
}) => {
  return (
    <Card justify="center">
      <BorderBottom height="xsmall" justify="center">
        <TextInput
          plain
          maxLength={20}
          placeholder="Guess here"
          size="large"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          css={{ textAlign: 'center', fontSize: '32px' }}
          data-testid="guessBox"
        />
      </BorderBottom>
      <Box>
        <SubmitButton
          disabled={!guess}
          onClick={onSubmitGuess}
          label="Submit"
          data-testid="submitGuess"
        />
      </Box>
    </Card>
  );
};

export { GuessCard };
