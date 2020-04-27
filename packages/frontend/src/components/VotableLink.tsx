import { Colour } from '@full-circle/shared/lib/canvas';
import { Box } from 'grommet';
import React, { FunctionComponent } from 'react';
import { ThumbDown, ThumbUp } from 'src/icons';
import styled from 'styled-components';

import { BaseButton } from './BaseButton';
import { IRenderLinkProps, RenderLink } from './RenderLink';

const DislikeButton = styled(BaseButton)`
  transition: 0.3s;
  fill: ${Colour.DARK_GRAY};
  padding: 16px;
  border: 4px solid ${Colour.DARK_GRAY};
  border-radius: 8px;

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

interface IVotableLinkProps extends IRenderLinkProps {
  onLike(): void;
  onDislike(): void;
}

export const VotableLink: FunctionComponent<IVotableLinkProps> = ({
  onLike,
  onDislike,
  ...renderLinkProps
}) => {
  return (
    <Box align="center">
      <RenderLink {...renderLinkProps} />
      <Box direction="row" justify="around" fill>
        <LikeButton onClick={onLike}>
          <ThumbUp />
        </LikeButton>
        <DislikeButton onClick={onDislike}>
          <ThumbDown />
        </DislikeButton>
      </Box>
    </Box>
  );
};
