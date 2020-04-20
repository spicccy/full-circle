import { revealChain } from '@full-circle/shared/lib/actions/client';
import { Box, Button, Heading, Paragraph } from 'grommet';
import React, { FunctionComponent } from 'react';
import { Card } from 'src/components/Card/Card';
import { useRoom } from 'src/contexts/RoomContext';

import { RenderChain } from '../../../../components/RenderChain';
import { Background } from '../components/Background';

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
              You control this chain. Press next to see the next chain.
            </Heading>
          ) : null}
          <Paragraph fill>Tap a prompt or picture to vote for it</Paragraph>
          {chain ? <RenderChain votable chain={chain} /> : null}
        </Card>
        <Card pad="large" align="center" justify="center">
          {isController ? (
            <>
              <Paragraph>
                Make sure you give everyone enough time to vote.
              </Paragraph>
              <Button onClick={onSubmit} size="large" label="Next Chain" />
            </>
          ) : (
            <Paragraph>
              You're viewing someone else's chain. Wait until they have pressed
              next.
            </Paragraph>
          )}
        </Card>
      </Box>
    </Background>
  );
};

export { RevealPage };
