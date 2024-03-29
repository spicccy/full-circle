import { Box } from 'grommet';
import React, { FunctionComponent } from 'react';
import { ScoreboardPage } from 'src/components/Scoreboard';

const EndPage: FunctionComponent = () => {
  return (
    <Box
      css={{ position: 'relative' }}
      fill
      flex
      background="light-2"
      justify="center"
      align="center"
      pad="large"
    >
      <ScoreboardPage />
    </Box>
  );
};

export { EndPage };
