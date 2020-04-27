import { vote } from '@full-circle/shared/lib/actions/client';
import { Colour } from '@full-circle/shared/lib/canvas';
import { ILink, VoteType } from '@full-circle/shared/lib/roomState';
import { Box } from 'grommet';
import React, { FunctionComponent } from 'react';
import { useRoom } from 'src/contexts/RoomContext';
import { ThumbDown, ThumbUp } from 'src/icons';
import styled, { css } from 'styled-components';
import invariant from 'tiny-invariant';

import { BaseButton } from './BaseButton';
import { RenderLink } from './RenderLink';

const DislikeButton = styled(BaseButton)<{ active: boolean }>`
  transition: 0.3s;
  fill: ${Colour.DARK_GRAY};
  padding: 16px;
  border: 4px solid ${Colour.DARK_GRAY};
  border-radius: 8px;

  ${(props) =>
    props.active &&
    css`
      border-color: ${Colour.RED};
      fill: ${Colour.RED};
    `}
`;

const LikeButton = styled(BaseButton)<{ active: boolean }>`
  transition: 0.3s;
  fill: ${Colour.DARK_GRAY};
  padding: 16px;
  border: 4px solid ${Colour.DARK_GRAY};
  border-radius: 8px;

  ${(props) =>
    props.active &&
    css`
      border-color: ${Colour.GREEN};
      fill: ${Colour.GREEN};
    `}
`;

interface IVotableLinkProps {
  link: ILink;
}

export const VotableLink: FunctionComponent<IVotableLinkProps> = ({ link }) => {
  const { room, sendAction, syncedState } = useRoom();
  invariant(room);

  const playerId = room.sessionId;
  const linkVotes = syncedState?.votes[link.id];
  const currentPlayerVote = linkVotes?.playerVotes[playerId];

  const handleVote = (voteType: VoteType) => {
    sendAction(vote({ linkId: link.id, voteType }));
  };

  const handleLike = () =>
    currentPlayerVote === VoteType.LIKE
      ? handleVote(VoteType.NONE)
      : handleVote(VoteType.LIKE);
  const handleDislike = () =>
    currentPlayerVote === VoteType.DISLIKE
      ? handleVote(VoteType.NONE)
      : handleVote(VoteType.DISLIKE);

  return (
    <Box align="center">
      <RenderLink
        link={link}
        playersMap={syncedState?.playerManager.playerMap ?? {}}
      />
      {link.playerId && (
        <Box direction="row" justify="around" fill>
          <LikeButton
            active={currentPlayerVote === VoteType.LIKE}
            onClick={handleLike}
          >
            <ThumbUp />
          </LikeButton>
          <DislikeButton
            active={currentPlayerVote === VoteType.DISLIKE}
            onClick={handleDislike}
          >
            <ThumbDown />
          </DislikeButton>
        </Box>
      )}
    </Box>
  );
};
