import { Colour } from '@full-circle/shared/lib/canvas';
import { IPlayer, StickyNoteColour } from '@full-circle/shared/lib/roomState';
import { FunctionComponent } from 'react';
import React from 'react';
import { useRoom } from 'src/contexts/RoomContext';
import styled from 'styled-components';

import { IRandomStickyNoteData, StickyNote } from './StickyNote';

const PlayerStickyNote = styled(StickyNote)`
  font-size: 24px;
  color: ${Colour.BLACK};
`;

interface IPlayerProps {
  player: IPlayer;
  randomData?: IRandomStickyNoteData;
}

export const Player: FunctionComponent<IPlayerProps> = ({
  player,
  randomData,
}) => {
  const { syncedState } = useRoom();

  // TODO: change player location if player submitted
  // const playerSubmitted = Boolean(syncedState?.submittedPlayers?.[player.id]);

  const playerState = syncedState?.playerManager?.playerMap?.[player.id];
  const disconnected = Boolean(playerState?.disconnected);
  const stickyNoteColour =
    playerState?.stickyNoteColour ?? StickyNoteColour.GRAY;

  return (
    <PlayerStickyNote
      align="center"
      justify="center"
      colour={disconnected ? StickyNoteColour.GRAY : stickyNoteColour}
      size="150px"
      randomData={randomData}
    >
      {player && player.username}
    </PlayerStickyNote>
  );
};
