import { Button, TextInput } from 'grommet';
import React, { FunctionComponent, useState } from 'react';
import { Card } from 'src/components/Card/Card';
import styled from 'styled-components/macro';

const SubmitButton = styled(Button)`
  position: absolute;
  right: 0;
  bottom: 0;
  font-size: 20px;
  padding: 12px;
  text-decoration: 2px underline;
  width: min-content;
`;

interface IGuessCardProps {
  onSubmitGuess(guess: string): void;
}

const GuessCard: FunctionComponent<IGuessCardProps> = ({ onSubmitGuess }) => {
  const [guess, setGuess] = useState('');

  const handleSubmitGuess = () => {
    onSubmitGuess(guess);
  };

  return (
    <Card height="xsmall" justify="center">
      <TextInput
        plain
        maxLength={20}
        placeholder="Enter your guess"
        size="large"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        css={{ textAlign: 'center' }}
      />
      <SubmitButton
        plain
        disabled={!guess}
        onClick={handleSubmitGuess}
        label="Submit"
      />
    </Card>
  );
};

export { GuessCard };
