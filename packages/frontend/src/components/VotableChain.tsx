import { vote } from '@full-circle/shared/lib/actions/client';
import { IChain, ILink } from '@full-circle/shared/lib/roomState/interfaces';
import { Box } from 'grommet';
import React, { FunctionComponent } from 'react';
import { useRoom } from 'src/contexts/RoomContext';
import invariant from 'tiny-invariant';

import { VotableLink } from './VotableLink';

interface IRenderChainProps {
  chain: IChain;
}

export const VotableChain: FunctionComponent<IRenderChainProps> = ({
  chain,
}) => {
  const { room, sendAction, syncedState } = useRoom();
  invariant(room);

  const { links } = chain;

  const handleLike = (link: ILink) => {
    const { playerId, id } = link;
    sendAction(vote({ playerId, linkId: id, vote: 'like' }));
  };

  const handleDislike = (link: ILink) => {
    const { playerId, id } = link;
    sendAction(vote({ playerId, linkId: id, vote: 'dislike' }));
  };

  return (
    <Box direction="row" wrap justify="center" align="center">
      {links.map((link) => (
        <VotableLink
          key={link.id}
          playersMap={syncedState?.playerManager.playerMap ?? {}}
          link={link}
          onLike={() => handleLike(link)}
          onDislike={() => handleDislike(link)}
        />
      ))}
    </Box>
  );
};
