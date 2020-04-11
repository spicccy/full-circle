import 'styled-components/macro';

import { Box, TextInput } from 'grommet';
import React, { FunctionComponent, useState } from 'react';
import { Card } from 'src/components/Card/Card';

import { BorderBottom } from '../components/BorderBottom';
import { SubmitButton } from '../components/SubmitButton';

interface IGuessCardProps {
  onSubmitGuess(guess: string): void;
  submitted: boolean;
}

const GuessCard: FunctionComponent<IGuessCardProps> = ({
  onSubmitGuess,
  submitted,
}) => {
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
          disabled={submitted}
          onChange={(e) => setGuess(e.target.value)}
          css={{ textAlign: 'center', fontSize: '32px' }}
        />
      </BorderBottom>
      <Box>
        <SubmitButton
          disabled={!guess || submitted}
          onClick={handleSubmitGuess}
          label="Submit"
        />
      </Box>
    </Card>
  );
};

export { GuessCard };
