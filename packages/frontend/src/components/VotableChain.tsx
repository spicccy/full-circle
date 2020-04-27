import { IChain } from '@full-circle/shared/lib/roomState/interfaces';
import { Box } from 'grommet';
import { LinkDown } from 'grommet-icons';
import React, { FunctionComponent } from 'react';

import { VotableLink } from './VotableLink';

interface IRenderChainProps {
  chain: IChain;
}

export const VotableChain: FunctionComponent<IRenderChainProps> = ({
  chain,
}) => {
  return (
    <Box direction="column" align="center" gap="small">
      {chain.links.map((link, i) => (
        <>
          {i !== 0 && <LinkDown />}
          <VotableLink key={link.id} link={link} />
        </>
      ))}
    </Box>
  );
};
