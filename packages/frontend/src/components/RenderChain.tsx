import { IChain } from '@full-circle/shared/lib/roomState/interfaces';
import { Box, Paragraph } from 'grommet';
import React, { FunctionComponent } from 'react';
import { useRoomHelpers } from 'src/hooks/useRoomHelpers';

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
  const { getUsername } = useRoomHelpers();
  const chainStarter = getUsername(chain.owner) ?? 'No Player Found';
  return (
    <Box fill pad="medium" justify="center" align="center">
      {chainStarter}
      <Paragraph> Press NEXT on your phone to end the chain viewing</Paragraph>
      <Box direction="row" wrap justify="center" align="center">
        {links}
      </Box>
    </Box>
  );
};
