import { IChain } from '@full-circle/shared/lib/roomState/interfaces';
import { Box } from 'grommet';
import React, { FunctionComponent } from 'react';
import { CuratorSvg } from 'src/components/CuratorSvg';

import { RenderLink } from './RenderLink';

interface IRenderChainProps {
  chain: IChain;
}

export const RenderChain: FunctionComponent<IRenderChainProps> = ({
  chain,
}) => {
  const links = chain.links.map((link, index) => (
    <RenderLink link={link} key={index} />
  ));
  return (
    <Box flex>
      <CuratorSvg />
      <Box pad="small" align="center" fill>
        <Box direction="row" wrap justify="center" align="center">
          {links}
        </Box>
      </Box>
    </Box>
  );
};
