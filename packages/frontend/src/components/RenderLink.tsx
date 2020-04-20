import { Colour } from '@full-circle/shared/lib/canvas';
import { StickyNoteColour } from '@full-circle/shared/lib/roomState';
import { ILink } from '@full-circle/shared/lib/roomState/interfaces';
import { Box, Text } from 'grommet';
import React, { FunctionComponent } from 'react';
import { useRoomHelpers } from 'src/hooks/useRoomHelpers';
import styled from 'styled-components';

import { ViewCanvas } from './Canvas/ViewCanvas';
import { StickyNote } from './StickyNote';

interface IRenderLinkProps {
  link: ILink;
}

const LinkStickyNote = styled(StickyNote)`
  font-size: 24px;
  color: ${Colour.BLACK};
`;

/*TODO:
  Each stickynote should have a
  tilt angle
*/

export const RenderLink: FunctionComponent<IRenderLinkProps> = ({ link }) => {
  const { getPlayer } = useRoomHelpers();
  const player = getPlayer(link.playerId);
  const playerColour = player?.stickyNoteColour ?? StickyNoteColour.GRAY;
  if (link.type === 'image') {
    const guessPlayerUsername = player ? player.username : link.playerId;
    const canvasActions = link.data ? JSON.parse(link.data) : [];
    return (
      <Box>
        <LinkStickyNote margin="medium" colour={playerColour} size="180px">
          <Box fill flex align="center" justify="center">
            <ViewCanvas canvasActions={canvasActions} />
          </Box>
          <Text size="small" alignSelf="end" textAlign="center">
            - {guessPlayerUsername}
          </Text>
        </LinkStickyNote>
      </Box>
    );
  }

  const promptPlayerUsername = player ? player.username : link.playerId;
  return (
    <Box>
      <LinkStickyNote margin="medium" colour={playerColour} size="180px">
        <Box fill flex justify="center" align="center">
          <Text>{link.data}</Text>
        </Box>
        <Text alignSelf="end" size="small" textAlign="center">
          - {promptPlayerUsername}
        </Text>
      </LinkStickyNote>
    </Box>
  );
};
