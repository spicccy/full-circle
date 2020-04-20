import 'styled-components/macro';

import { IChain } from '@full-circle/shared/lib/roomState/interfaces';
import { Box, Paragraph } from 'grommet';
import React, { FunctionComponent } from 'react';
import { RenderChain } from 'src/components/RenderChain';

interface IInGameReveal {
  chain: IChain | null;
}

const IngameReveal: FunctionComponent<IInGameReveal> = ({ chain }) => {
  if (chain === null) {
    return (
      <Box flex align="center" justify="center">
        <Paragraph> We will be seeing the Reveal Screen shortly</Paragraph>
      </Box>
    );
  }
  return <Box fill>{<RenderChain chain={chain} />}</Box>;
};

export { IngameReveal };
