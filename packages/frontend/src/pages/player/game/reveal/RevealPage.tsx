import { revealChain } from '@full-circle/shared/lib/actions/client';
import { Colour } from '@full-circle/shared/lib/canvas';
import { Box, Button, Heading, Paragraph } from 'grommet';
import React, { FunctionComponent } from 'react';
import { BaseButton } from 'src/components/BaseButton';
import { Card } from 'src/components/Card/Card';
import { useRoom } from 'src/contexts/RoomContext';
import { ThumbDown, ThumbUp } from 'src/icons';
import styled from 'styled-components';

import { RenderChain } from '../../../../components/RenderChain';
import { Background } from '../components/Background';

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

const RevealPage: FunctionComponent = () => {
  const { room, syncedState } = useRoom();

  const onSubmit = () => {
    room?.send(revealChain());
  };

  const isController =
    syncedState?.chainManager?.revealedChain?.owner === room?.sessionId;

  const chain = syncedState?.chainManager?.revealedChain;

  return (
    <Background>
      <Box width="medium">
        <Card margin="medium" pad="large" align="center" justify="center">
          {isController ? (
            <Heading level={5}>
              You started this chain. Look what you've done.
            </Heading>
          ) : null}
          <Paragraph fill>Tap a prompt or picture to vote for it</Paragraph>
          {chain ? <RenderChain chain={chain} /> : null}
        </Card>
        <Card pad="large" align="center" justify="center">
          <Button
            disabled={!isController}
            onClick={onSubmit}
            size="large"
            label="Next Chain"
          />
        </Card>
      </Box>
    </Background>
  );
};

export { RevealPage };
