import { IPlayer, StickyNoteColour } from '@full-circle/shared/lib/roomState';
import { FunctionComponent } from 'react';
import React from 'react';
import { IRandomStickyNoteData, StickyNote } from 'src/components/StickyNote';
import styled from 'styled-components';

const PlayerStickyNote = styled(StickyNote)<{ submitted: boolean }>`
  font-size: 24px;
  ${(props) => props.submitted && `border: 8px solid black;`}
`;

interface IPlayerProps {
  player: IPlayer;
  randomData?: IRandomStickyNoteData;
}

export const Player: FunctionComponent<IPlayerProps> = ({
  player,
  randomData,
}) => {
  const stickyNoteColour = player.disconnected
    ? StickyNoteColour.GRAY
    : player.stickyNoteColour;

  return (
    <PlayerStickyNote
      align="center"
      justify="center"
      colour={stickyNoteColour}
      size="150px"
      randomData={randomData}
      submitted={player.submitted}
    >
      {player && player.username}
    </PlayerStickyNote>
  );
};
