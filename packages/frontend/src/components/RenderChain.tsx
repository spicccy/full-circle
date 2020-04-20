import { IChain } from '@full-circle/shared/lib/roomState/interfaces';
import { Box, Heading, Paragraph } from 'grommet';
import React, { FunctionComponent } from 'react';
import { CuratorSvg } from 'src/components/CuratorSvg';
import { useRoomHelpers } from 'src/hooks/useRoomHelpers';
import { mockChain } from 'src/pages/curator/IngamePages/mockChain';

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
    <Box flex css={{ position: 'relative' }} align="center">
      <CuratorSvg />
      <Heading size="small">{chainStarter}</Heading>
      <Paragraph> Press NEXT on your phone to end the chain viewing</Paragraph>
      <Box direction="row" wrap justify="center" align="center">
        {links}
      </Box>
    </Box>
  );
};
