import { Box, Paragraph } from 'grommet';
import React, { FunctionComponent } from 'react';
import { RenderChain } from 'src/components/RenderChain';
import { useRoom } from 'src/contexts/RoomContext';

const IngameReveal: FunctionComponent = () => {
  const { syncedState } = useRoom();
  const chain = syncedState?.chainManager.revealedChain;

  if (!chain) {
    return (
      <Box flex align="center" justify="center">
        <Paragraph> We will be seeing the Reveal Screen shortly</Paragraph>
      </Box>
    );
  }

  return <Box fill>{<RenderChain chain={chain} />}</Box>;
};

export { IngameReveal };
