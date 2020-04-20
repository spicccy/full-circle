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
    const guessPlayerUsername = player ? player.username : '';
    const canvasActions = link.data ? JSON.parse(link.data) : [];
    return (
      <Box>
        <LinkStickyNote
          align="center"
          justify="center"
          margin="medium"
          colour={playerColour}
          size="180px"
        >
          <ViewCanvas canvasActions={canvasActions} />
        </LinkStickyNote>
        <Text textAlign="center">{guessPlayerUsername}</Text>
      </Box>
    );
  }

  const promptPlayerUsername = player ? player.username : '';
  return (
    <Box>
      <LinkStickyNote
        align="center"
        justify="center"
        margin="medium"
        colour={playerColour}
        size="180px"
      >
        <Text>{link.data}</Text>
      </LinkStickyNote>
      <Text textAlign="center">{promptPlayerUsername}</Text>
    </Box>
  );
};
