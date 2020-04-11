import 'styled-components/macro';

import { Box, TextInput } from 'grommet';
import React, { FunctionComponent, useState } from 'react';
import { Card } from 'src/components/Card/Card';

import { BorderBottom } from '../components/BorderBottom';
import { SubmitButton } from '../components/SubmitButton';

interface IGuessCardProps {
  onSubmitGuess(guess: string): void;
}

const GuessCard: FunctionComponent<IGuessCardProps> = ({ onSubmitGuess }) => {
  const [guess, setGuess] = useState('');

  const handleSubmitGuess = () => {
    onSubmitGuess(guess);
  };

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
        />
      </BorderBottom>
      <Box>
        <SubmitButton
          disabled={!guess}
          onClick={handleSubmitGuess}
          label="Submit"
          data-testid="submitGuess"
        />
      </Box>
    </Card>
  );
};

export { GuessCard };
