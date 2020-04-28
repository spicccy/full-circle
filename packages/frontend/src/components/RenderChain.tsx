import { vote } from '@full-circle/shared/lib/actions/client';
import { Colour } from '@full-circle/shared/lib/canvas';
import { IChain, ILink } from '@full-circle/shared/lib/roomState/interfaces';
import { Box } from 'grommet';
import React, { FunctionComponent } from 'react';
import { useRoom } from 'src/contexts/RoomContext';
import { ThumbDown, ThumbUp } from 'src/icons';
import styled from 'styled-components';

import { CuratorSvg } from '../pages/curator/IngamePages/components/CuratorSvg';
import { BaseButton } from './BaseButton';
import { RenderLink } from './RenderLink';

interface IRenderChainProps {
  chain: IChain;
  votable?: boolean;
}

const DislikeButton = styled(BaseButton)`
  transition: 0.3s;
  fill: ${Colour.DARK_GRAY};
  padding: 16px;
  border: 4px solid ${Colour.DARK_GRAY};
  border-radius: 8px;

  margin-right: 32px;

  :hover,
  :focus {
    border-color: ${Colour.RED};
    fill: ${Colour.RED};
  }
`;

const LikeButton = styled(BaseButton)`
  transition: 0.3s;
  fill: ${Colour.DARK_GRAY};
  padding: 16px;
  border: 4px solid ${Colour.DARK_GRAY};
  border-radius: 8px;

  :hover,
  :focus {
    border-color: ${Colour.GREEN};
    fill: ${Colour.GREEN};
  }
`;

export const RenderChain: FunctionComponent<IRenderChainProps> = ({
  chain,
  votable,
}) => {
  const { room } = useRoom();

  const { links } = chain;

  const renderLinks = (links: ILink[]) => {
    if (votable) {
      return links.map((link) => (
        <Box align="center">
          <RenderLink link={link}></RenderLink>
          <Box direction="row" flex>
            <DislikeButton
              onClick={() => {
                const { playerId, id } = link;
                room?.send(vote({ playerId, linkId: id, vote: 'dislike' }));
              }}
              data-testid="dislikeButton"
            >
              <ThumbDown></ThumbDown>
            </DislikeButton>
            <LikeButton
              onClick={() => {
                const { playerId, id } = link;
                room?.send(vote({ playerId, linkId: id, vote: 'like' }));
              }}
              data-testid="likeButton"
            >
              <ThumbUp></ThumbUp>
            </LikeButton>
          </Box>
        </Box>
      ));
    } else {
      return links.map((link) => <RenderLink link={link}></RenderLink>);
    }
  };

  return (
    <Box flex>
      <CuratorSvg />
      <Box pad="small" align="center" fill>
        <Box direction="row" wrap justify="center" align="center">
          {renderLinks(links)}
        </Box>
      </Box>
    </Box>
  );
};
