import { ILink } from '@full-circle/shared/lib/roomState/interfaces';
import { Box, Text } from 'grommet';
import React, { FunctionComponent } from 'react';
import { useRoomHelpers } from 'src/hooks/useRoomHelpers';
import styled from 'styled-components';

import { ViewCanvas } from './Canvas/ViewCanvas';

interface IRenderLinkProps {
  link: ILink;
}

// const LinkLocation = styled.div<>``;

export const RenderLink: FunctionComponent<IRenderLinkProps> = ({ link }) => {
  const { getUsername } = useRoomHelpers();

  if (link.type === 'image') {
    const guessPlayerUsername = getUsername(link.playerId) ?? 'User Not Found';
    const canvasActions = link.data ? JSON.parse(link.data) : [];
    return (
      <Box>
        <Box height="small" width="small" background="red" margin="medium">
          <ViewCanvas canvasActions={canvasActions} />
        </Box>
        <Text textAlign="center">{guessPlayerUsername}</Text>
      </Box>
    );
  }

  const promptPlayerUsername = getUsername(link.playerId) ?? 'Starting Prompt';
  return (
    <Box>
      <Box
        height="small"
        width="small"
        background="orange"
        margin="medium"
        align="center"
        justify="center"
      >
        <Text>{link.data}</Text>
      </Box>
      <Text textAlign="center">{promptPlayerUsername}</Text>
    </Box>
  );
};
