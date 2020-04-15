import 'styled-components/macro';

import { objectValues } from '@full-circle/shared/lib/helpers';
import { Box } from 'grommet';
import { FunctionComponent } from 'react';
import React from 'react';
import { useRoom } from 'src/contexts/RoomContext';
import { Whiteboard } from 'src/icons';
import styled from 'styled-components/macro';

import { AllPlayersCircle } from './AllPlayersCircle';
import { Player } from './Player';

const arrayOfAngles: number[] = [10, 30, 170, 150, 190, 210, 330, 350];

const WhiteboardBackground = styled(Whiteboard)`
  height: 100%;
  width: 100%;
`;

export const PlayerBackground: FunctionComponent = () => {
  const { syncedState } = useRoom();
  const arrayOfPlayers = objectValues(syncedState?.players ?? {});
  const playerBoxes = arrayOfAngles.map((angle, index) => (
    <Player angle={angle} player={arrayOfPlayers[index]} key={index} />
  ));

  return (
    <Box
      css={{ position: 'absolute', zIndex: -1 }}
      overflow="hidden"
      fill
      align="center"
      justify="center"
    >
      <AllPlayersCircle />
      <WhiteboardBackground preserveAspectRatio="none" />

      {playerBoxes}
    </Box>
  );
};
