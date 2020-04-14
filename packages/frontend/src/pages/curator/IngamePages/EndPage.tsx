import { Box } from 'grommet';
import React, { FunctionComponent } from 'react';

import { Scoreboard } from '../../../components/Scoreboard';

const EndPage: FunctionComponent = () => {
  return (
    <Box css={{ position: 'relative' }} fill>
      <Scoreboard />
    </Box>
  );
};

export { EndPage };
