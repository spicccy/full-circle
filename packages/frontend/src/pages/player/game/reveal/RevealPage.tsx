import { revealChain } from '@full-circle/shared/lib/actions/client';
import { Colour } from '@full-circle/shared/lib/canvas';
import { Box, Button } from 'grommet';
import React, { FunctionComponent } from 'react';
import { BaseButton } from 'src/components/BaseButton';
import { Card } from 'src/components/Card/Card';
import { useRoom } from 'src/contexts/RoomContext';
import { ThumbDown, ThumbUp } from 'src/icons';
import styled from 'styled-components';

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

  return (
    <Background>
      <Box width="medium">
        <Card pad="large" align="center" justify="center">
          <Box direction="row" margin={{ bottom: 'medium' }}>
            <DislikeButton>
              <ThumbDown />
            </DislikeButton>
            <LikeButton>
              <ThumbUp />
            </LikeButton>
          </Box>
          <Button
            disabled={!isController}
            onClick={onSubmit}
            size="large"
            label="Next"
          />
        </Card>
      </Box>
    </Background>
  );
};

export { RevealPage };
