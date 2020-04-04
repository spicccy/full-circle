import 'styled-components/macro';

import { objectValues } from '@full-circle/shared/lib/helpers';
import { Box } from 'grommet';
import { FunctionComponent } from 'react';
import React from 'react';
import { useRoom } from 'src/contexts/RoomContext';

import { AllPlayersCircle } from './AllPlayersCircle';
import { Player } from './Player';

const arrayOfAngles: number[] = [10, 30, 170, 150, 190, 210, 330, 350];

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
      {playerBoxes}
    </Box>
  );
};
