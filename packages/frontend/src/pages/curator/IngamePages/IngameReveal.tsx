import { Box, Heading, Paragraph } from 'grommet';
import React, { FunctionComponent } from 'react';
import { RenderChainContainer } from 'src/components/RenderChain';
import { useRoom } from 'src/contexts/RoomContext';
import { useRoomHelpers } from 'src/hooks/useRoomHelpers';

import { BackButton } from './components/BackButton';
import { CuratorSvg } from './components/CuratorSvg';

const IngameReveal: FunctionComponent = () => {
  const { syncedState } = useRoom();
  const { getPlayer } = useRoomHelpers();

  const renderBody = () => {
    const chain = syncedState?.chainManager.revealedChain;

    if (!chain) {
      return (
        <Box flex align="center" justify="center">
          <Paragraph> We will be seeing the Reveal Screen shortly</Paragraph>
        </Box>
      );
    }

    const ownerName = getPlayer(chain.owner)?.username ?? '';

    return (
      <Box height="100vh" width="100vw" pad="large">
        <Box flex overflow="auto" align="center">
          <Heading level="2">{ownerName}'s Chain</Heading>
          {<RenderChainContainer chain={chain} />}
        </Box>
      </Box>
    );
  };

  return (
    <Box flex>
      <BackButton />
      <CuratorSvg />
      {renderBody()}
    </Box>
  );
};

export { IngameReveal };
