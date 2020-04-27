import { IChain, IPlayer } from '@full-circle/shared/lib/roomState/interfaces';
import { Box } from 'grommet';
import { Next } from 'grommet-icons';
import React, { FunctionComponent } from 'react';
import { useRoom } from 'src/contexts/RoomContext';

import { RenderLink } from './RenderLink';

interface IRenderChainProps {
  chain: IChain;
  playersMap: Record<string, IPlayer>;
}

export const RenderChain: FunctionComponent<IRenderChainProps> = ({
  chain,
  playersMap,
}) => {
  return (
    <Box direction="row" wrap justify="center" align="center">
      {chain.links.map((link, i) => (
        <>
          {i !== 0 && <Next />}
          <RenderLink key={link.id} link={link} playersMap={playersMap} />
        </>
      ))}
    </Box>
  );
};

interface IRenderChainContainerProps {
  chain: IChain;
}

export const RenderChainContainer: FunctionComponent<IRenderChainContainerProps> = ({
  chain,
}) => {
  const { syncedState } = useRoom();

  const playersMap = syncedState?.playerManager.playerMap ?? {};
  return <RenderChain chain={chain} playersMap={playersMap} />;
};
