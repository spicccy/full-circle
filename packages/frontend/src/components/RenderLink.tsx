import { Colour } from '@full-circle/shared/lib/canvas';
import { StickyNoteColour } from '@full-circle/shared/lib/roomState';
import { ILink, IPlayer } from '@full-circle/shared/lib/roomState/interfaces';
import { Box, Text } from 'grommet';
import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

import { ViewCanvas } from './Canvas/ViewCanvas';
import { StickyNote } from './StickyNote';

export interface IRenderLinkProps {
  link: ILink;
  playersMap: Record<string, IPlayer>;
}

const LinkStickyNote = styled(StickyNote)`
  position: relative;
  font-size: 24px;
  color: ${Colour.BLACK};
  user-select: none;
`;

const PlayerName = styled(Text)`
  position: absolute;
  bottom: 0;
  right: 0;
`;

/*TODO:
  Each stickynote should have a
  tilt angle
*/

export const RenderLink: FunctionComponent<IRenderLinkProps> = ({
  link,
  playersMap,
}) => {
  const player = playersMap[link.playerId];
  const playerColour = player?.stickyNoteColour ?? StickyNoteColour.GRAY;

  if (link.type === 'image') {
    const guessPlayerUsername = player ? player.username : 'Starting image';
    const canvasActions = link.data ? JSON.parse(link.data) : [];
    return (
      <LinkStickyNote margin="medium" colour={playerColour} size="180px">
        <Box fill flex align="center" justify="center">
          <ViewCanvas canvasActions={canvasActions} />
        </Box>
        <PlayerName size="small">- {guessPlayerUsername}</PlayerName>
      </LinkStickyNote>
    );
  }

  const promptPlayerUsername = player ? player.username : 'Starting prompt';
  return (
    <Box>
      <LinkStickyNote margin="medium" colour={playerColour} size="180px">
        <Box fill flex justify="center" align="center">
          <Text>{link.data}</Text>
        </Box>
        <PlayerName size="small">- {promptPlayerUsername}</PlayerName>
      </LinkStickyNote>
    </Box>
  );
};
