import 'styled-components/macro';

import { Box } from 'grommet';
import React, { FunctionComponent } from 'react';
import { Whiteboard } from 'src/icons';
import styled from 'styled-components/macro';

const WhiteboardBackground = styled(Whiteboard)`
  height: 100%;
  width: 100%;
`;

export const CuratorSvg: FunctionComponent = () => {
  return (
    <Box
      css={{ position: 'fixed', zIndex: -1 }}
      overflow="hidden"
      fill
      align="center"
      justify="center"
    >
      <WhiteboardBackground preserveAspectRatio="none" />
    </Box>
  );
};
