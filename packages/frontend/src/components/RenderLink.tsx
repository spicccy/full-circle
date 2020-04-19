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
  const promptPlayerUsername =
    getUsername(link.prompt.playerId) ?? 'Starting Prompt';
  const guessPlayerUsername =
    getUsername(link.image.playerId) ?? 'User Not Found';
  return (
    <Box direction="row">
      <Box>
        <Box
          height="small"
          width="small"
          background="orange"
          margin="medium"
          align="center"
          justify="center"
        >
          <Text>{link.prompt.text}</Text>
        </Box>
        <Text textAlign="center">{promptPlayerUsername}</Text>
      </Box>
      <Box>
        <Box height="small" width="small" background="red" margin="medium">
          <ViewCanvas canvasActions={JSON.parse(link.image.imageData || '')} />
        </Box>
        <Text textAlign="center">{guessPlayerUsername}</Text>
      </Box>
    </Box>
  );
};
