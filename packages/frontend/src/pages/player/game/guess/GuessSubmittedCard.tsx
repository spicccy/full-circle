import { Heading } from 'grommet';
import React, { FunctionComponent } from 'react';
import { Card } from 'src/components/Card/Card';

interface IGuessSubmittedCardProps {
  guess: string;
}

const GuessSubmittedCard: FunctionComponent<IGuessSubmittedCardProps> = ({
  guess,
}) => {
  return (
    <Card>
      <Heading level="2" textAlign="center">
        Submitted!
      </Heading>
      <Heading level="3" textAlign="center">
        {guess}
      </Heading>
    </Card>
  );
};

export { GuessSubmittedCard };
