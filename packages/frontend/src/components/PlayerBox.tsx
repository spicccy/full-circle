import styled from 'styled-components';
import { FunctionComponent } from 'react';
import React from 'react';
import { Box } from 'grommet';
import { IPlayer } from '@full-circle/shared/lib/roomState/interfaces';

export interface ICoord {
  x: number;
  y: number;
}

const PlayerLocation = styled.div<ICoord>`
  position: absolute;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
`;

interface IPlayerBoxProps {
  player?: IPlayer;
  coord: ICoord;
}

export const PlayerBox: FunctionComponent<IPlayerBoxProps> = ({
  player,
  coord,
}) => {
  return (
    <PlayerLocation x={coord.x} y={coord.y}>
      <Box background="dark-3" pad="xsmall">
        {player ? `Player ${player.username} has joined` : 'No user has joined'}
      </Box>
    </PlayerLocation>
  );
};
