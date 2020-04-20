import 'styled-components/macro';

import { Box, Heading, Paragraph } from 'grommet';
import React, { FunctionComponent } from 'react';
import { useRoom } from 'src/contexts/RoomContext';

import { BackButton } from './components/BackButton';
import { CuratorTimer } from './components/CuratorTimer';
import { RoomCodeBox } from './components/RoomCodeBox';

const IngameGuess: FunctionComponent = () => {
  const { syncedState } = useRoom();

  const renderBody = () => {
    if (syncedState?.showBuffer) {
      return (
        <Box align="center" justify="center">
          <Heading> Transitioning </Heading>
          <Paragraph>We will begin the next stage shortly.</Paragraph>
        </Box>
      );
    }
    return (
      <Box align="center" justify="center">
        <Heading>Guessing Phase</Heading>
        <Paragraph>It's time to g-g-g-g-g-g-g-guess</Paragraph>
        <CuratorTimer />
      </Box>
    );
  };

  return (
    <Box flex>
      <BackButton />
      <RoomCodeBox />
      <Box flex align="center" justify="center">
        {renderBody()}
      </Box>
    </Box>
  );
};

export { IngameGuess };
