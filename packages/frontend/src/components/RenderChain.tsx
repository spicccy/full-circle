import { IChain } from '@full-circle/shared/lib/roomState/interfaces';
import { Box, Text } from 'grommet';
import React, { FunctionComponent } from 'react';
import { useRoomHelpers } from 'src/hooks/useRoomHelpers';
import { mockChain } from 'src/pages/curator/IngamePages/mockChain';

import { RenderLink } from './RenderLink';

interface IRenderChainProps {
  chain: IChain;
}

export const RenderChain: FunctionComponent<IRenderChainProps> = () => {
  const links = mockChain.links.map((link, index) => (
    <RenderLink link={link} key={index} />
  ));
  const { getUsername } = useRoomHelpers();
  const chainStarter = getUsername(mockChain.id) ?? 'No Player Found';
  return (
    <Box fill pad="medium" justify="center" align="center">
      {chainStarter}
      <Box direction="row" wrap justify="center" align="center" width="xlarge">
        {links}
      </Box>
    </Box>
  );
};
