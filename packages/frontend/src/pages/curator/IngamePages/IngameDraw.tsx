import 'styled-components/macro';

import { Box, Heading, Paragraph } from 'grommet';
import React, { FunctionComponent } from 'react';
import { CuratorTimer } from 'src/components/CuratorTimer';
import { LinkButton } from 'src/components/Link/LinkButton';
import { useRoom } from 'src/contexts/RoomContext';

const IngameDraw: FunctionComponent = () => {
  const { syncedState } = useRoom();

  const renderBody = () => {
    if (syncedState?.showBuffer) {
      return (
        <Box>
          <Heading> Transitioning </Heading>
          <Paragraph>We will begin the next stage shortly.</Paragraph>
        </Box>
      );
    }
    return (
      <Box>
        <Heading>Guessing Phase</Heading>
        <Paragraph>It's time to g-g-g-g-g-g-g-guess</Paragraph>
        <CuratorTimer />
      </Box>
    );
  };

  return (
    <Box css={{ position: 'relative' }} flex>
      <Box flex align="center" justify="center">
        {renderBody()}
        <LinkButton alignSelf="center" label="Go to Home" href="/create" />
      </Box>
    </Box>
  );
};

export { IngameDraw };
