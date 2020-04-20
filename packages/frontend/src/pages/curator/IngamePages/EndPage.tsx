import { Box } from 'grommet';
import React, { FunctionComponent } from 'react';
import { Scoreboard } from 'src/components/Scoreboard';
import { CuratorSvg } from 'src/components/CuratorSvg';

const EndPage: FunctionComponent = () => {
  return (
    <Box css={{ position: 'relative' }} flex>
      <CuratorSvg />
      <Scoreboard />
    </Box>
  );
};

export { EndPage };
