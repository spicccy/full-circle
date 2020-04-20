import { Box } from 'grommet';
import React, { FunctionComponent } from 'react';
import { CuratorSvg } from 'src/components/CuratorSvg';
import { Scoreboard } from 'src/components/Scoreboard';

const EndPage: FunctionComponent = () => {
  return (
    <Box
      css={{ position: 'relative' }}
      fill
      background="light-2"
      justify="center"
      align="center"
    >
      <CuratorSvg />
      <Scoreboard />
    </Box>
  );
};

export { EndPage };
