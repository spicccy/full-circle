import 'styled-components/macro';

import { IChain, ILink } from '@full-circle/shared/lib/roomState';
import { Box, Text } from 'grommet';
import React, { FunctionComponent } from 'react';
import { ViewCanvas } from 'src/components/Canvas/ViewCanvas';

interface IRenderChainProps {
  chain: IChain;
}

interface IRenderLinkProps {
  link: ILink;
}

interface IInGameReveal {
  chain: IChain | null;
}

const RenderLink: FunctionComponent<IRenderLinkProps> = ({ link }) => {
  if (link.type === 'image') {
    const canvasActions = link.data ? JSON.parse(link.data) : [];
    return (
      <Box height="small" width="small" background="red" margin="medium">
        <ViewCanvas canvasActions={canvasActions} />
      </Box>
    );
  }

  return (
    <Box
      height="small"
      width="small"
      background="red"
      margin="medium"
      align="center"
      justify="center"
    >
      <Text>{link.data ?? 'X'}</Text>
    </Box>
  );
};

const RenderChain: FunctionComponent<IRenderChainProps> = ({ chain }) => {
  const links = chain.links.map((link, index) => (
    <RenderLink link={link} key={index} />
  ));

  return (
    <Box background="black" fill>
      <Text textAlign="center">{chain.owner}</Text>
      <Box direction="row" wrap>
        {links}
      </Box>
    </Box>
  );
};

const IngameReveal: FunctionComponent<IInGameReveal> = ({ chain }) => {
  // const { syncedState } = useRoom();
  // const arrayOfPlayers = objectValues(syncedState?.players ?? {});

  return <Box fill>{chain && <RenderChain chain={chain} />}</Box>;
};

export { IngameReveal };
