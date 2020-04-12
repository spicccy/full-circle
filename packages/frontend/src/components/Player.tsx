import { Colour } from '@full-circle/shared/lib/canvas';
import { IPlayer } from '@full-circle/shared/lib/roomState/interfaces';
import { Box } from 'grommet';
import { FunctionComponent } from 'react';
import React from 'react';
import { useRoom } from 'src/contexts/RoomContext';
import styled from 'styled-components';

const PlayerLocation = styled.div<IPlayerBoxAngleProps>`
  position: absolute;
  transform: rotate(${(props) => props.angle}deg)
    translateX(calc((80vw + 80vh) / 4));
`;

const PlayerBox = styled(Box)<IPlayerBoxAngleProps>`
  font-family: PermanentMarker;
  font-size: 24px;
  color: ${Colour.BLACK};
  transform: rotate(${(props) => props.angle}deg);
`;

interface IPlayerBoxAngleProps {
  angle: number;
}

interface IPlayerProps {
  player?: IPlayer;
  angle: number;
}

function boxBackground(playerSubmitted?: boolean, disconnected?: boolean) {
  if (disconnected) {
    return Colour.DARK_GRAY;
  }
  if (playerSubmitted) {
    return Colour.ORANGE;
  } else {
    return Colour.WHITE;
  }
}

function boxBorder(playerSubmitted?: boolean, disconnected?: boolean) {
  if (disconnected) {
    return Colour.RED;
  }
  if (playerSubmitted) {
    return Colour.BLACK;
  } else {
    return Colour.ORANGE;
  }
}

export const Player: FunctionComponent<IPlayerProps> = ({ player, angle }) => {
  const { syncedState } = useRoom();
  const playerSubmitted = Boolean(
    player && syncedState?.submittedPlayers?.[player.id]
  );

  const disconnected = Boolean(
    player && syncedState?.players?.[player.id].disconnected
  );

  return (
    <PlayerLocation angle={angle}>
      <PlayerBox
        border={{
          color: boxBorder(playerSubmitted, disconnected),
          size: 'medium',
        }}
        angle={-angle}
        background={boxBackground(playerSubmitted, disconnected)}
        pad="small"
        round="small"
      >
        {player ? player.username : 'Waiting on Players'}
      </PlayerBox>
    </PlayerLocation>
  );
};
