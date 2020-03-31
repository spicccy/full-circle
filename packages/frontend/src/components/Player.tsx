import { Colour } from '@full-circle/shared/lib/canvas';
import { IPlayer } from '@full-circle/shared/lib/roomState/interfaces';
import { Box } from 'grommet';
import { FunctionComponent } from 'react';
import React from 'react';
import styled from 'styled-components';

const PlayerLocation = styled.div<IPlayerBoxAngleProps>`
  position: absolute;
  transform: rotate(${(props) => props.angle}deg)
    translateX(calc((90vw + 90vh) / 4));
`;

const PlayerBox = styled(Box)<IPlayerBoxAngleProps>`
  font-family: PermanentMarker;
  font-size: 24px;
  transform: rotate(${(props) => props.angle}deg);
`;

interface IPlayerBoxAngleProps {
  angle: number;
}

interface IPlayerProps {
  player?: IPlayer;
  angle: number;
}

export const Player: FunctionComponent<IPlayerProps> = ({ player, angle }) => {
  return (
    <PlayerLocation angle={angle}>
      <PlayerBox
        angle={-angle}
        background={Colour.ORANGE}
        pad="small"
        round="small"
      >
        {player ? `Player ${player.username} has joined` : 'No user has joined'}
      </PlayerBox>
    </PlayerLocation>
  );
};
