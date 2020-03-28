import 'styled-components/macro';

import { Box, BoxProps, Grommet } from 'grommet';
import React, { FunctionComponent } from 'react';
import { notepadTheme } from 'src/styles/notepadTheme';

const Card: FunctionComponent<BoxProps> = (props) => (
  <Grommet theme={notepadTheme}>
    <Box
      background="light-1"
      elevation="large"
      round="small"
      css={{ position: 'relative', overflow: 'hidden' }}
      {...props}
    />
  </Grommet>
);

export { Card };
