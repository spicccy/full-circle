import { revealChain } from '@full-circle/shared/lib/actions/client';
import { Box, Button, Heading, Paragraph } from 'grommet';
import React, { FunctionComponent, useEffect } from 'react';
import { Card } from 'src/components/Card/Card';
import { VotableChain } from 'src/components/VotableChain';
import { useRoom } from 'src/contexts/RoomContext';

import { Background } from '../components/Background';

const RevealPage: FunctionComponent = () => {
  const { sendAction, room, syncedState } = useRoom();

  const onSubmit = () => {
    sendAction(revealChain());
  };

  const isController =
    syncedState?.chainManager?.revealedChain?.owner === room?.sessionId;

  const chain = syncedState?.chainManager?.revealedChain;
  const owner = chain?.owner;

  useEffect(() => {
    window.scroll({
      top: 0,
      behavior: 'smooth',
    });
  }, [owner]);

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
          {chain ? <VotableChain chain={chain} /> : null}
        </Card>
        <Card pad="large" align="center" justify="center">
          {isController ? (
            <>
              <Paragraph>
                Make sure you give everyone enough time to vote.
              </Paragraph>
              <Button
                onClick={onSubmit}
                size="large"
                label="Next Chain"
                data-testid="nextChain"
              />
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
