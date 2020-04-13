import 'styled-components/macro';

import { IChain, ILink } from '@full-circle/shared/lib/roomState/interfaces';
import { Box, Text } from 'grommet';
import React, { FunctionComponent } from 'react';
import { ViewCanvas } from 'src/components/Canvas/ViewCanvas';
import { mockChain } from 'src/pages/curator/IngamePages/mockChain';

interface IRenderChainProps {
  chain: IChain;
}

interface IRenderLinkProps {
  link: ILink;
}

const RenderLink: FunctionComponent<IRenderLinkProps> = ({ link }) => {
  return (
    <Box direction="row">
      <Box>
        <Box
          height="small"
          width="small"
          background="red"
          margin="medium"
          align="center"
          justify="center"
        >
          <Text>{link.prompt.text}</Text>
        </Box>
        <Text textAlign="center">{link.prompt.playerId}</Text>
      </Box>
      <Box>
        <Box height="small" width="small" background="red" margin="medium">
          <ViewCanvas canvasActions={JSON.parse(link.image.imageData)} />
        </Box>
        <Text textAlign="center">{link.image.playerId}</Text>
      </Box>
    </Box>
  );
};

const RenderChain: FunctionComponent<IRenderChainProps> = ({ chain }) => {
  const links = chain.links.map((link, index) => (
    <RenderLink link={link} key={index} />
  ));

  return (
    <Box background="black" fill>
      <Text textAlign="center">{chain.id}</Text>
      <Box direction="row" wrap>
        {links}
      </Box>
    </Box>
  );
};

const IngameReveal: FunctionComponent = () => {
  // const { syncedState } = useRoom();
  // const arrayOfPlayers = objectValues(syncedState?.players ?? {});

  return (
    <Box fill>
      <RenderChain chain={mockChain} />
    </Box>
  );
};

export { IngameReveal };
