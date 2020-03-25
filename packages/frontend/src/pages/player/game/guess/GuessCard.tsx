import React, { FunctionComponent, useState } from 'react';
import { Grommet, Box, Button, TextInput } from 'grommet';
import { notepadTheme } from 'src/styles/notepadTheme';
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
    <Grommet theme={notepadTheme}>
      <Box
        background="light-1"
        elevation="large"
        round="small"
        height="xsmall"
        justify="center"
        css={{ position: 'relative' }}
      >
        <TextInput
          plain
          maxLength={20}
          placeholder="Enter your guess"
          size="large"
          value={guess}
          onChange={e => setGuess(e.target.value)}
          css={{ textAlign: 'center' }}
        />
        <SubmitButton
          plain
          disabled={!guess}
          onClick={handleSubmitGuess}
          label="Submit"
        />
      </Box>
    </Grommet>
  );
};

export { GuessCard };
