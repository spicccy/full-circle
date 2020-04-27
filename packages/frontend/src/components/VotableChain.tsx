import { IChain } from '@full-circle/shared/lib/roomState/interfaces';
import { Box } from 'grommet';
import React, { FunctionComponent } from 'react';

import { VotableLink } from './VotableLink';

interface IRenderChainProps {
  chain: IChain;
}

export const VotableChain: FunctionComponent<IRenderChainProps> = ({
  chain,
}) => {
  return (
    <Box direction="row" wrap justify="center" align="center">
      {chain.links.map((link) => (
        <VotableLink key={link.id} link={link} />
      ))}
    </Box>
  );
};
