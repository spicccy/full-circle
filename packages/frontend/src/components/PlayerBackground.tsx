import 'styled-components/macro';

import { objectKeys, objectValues } from '@full-circle/shared/lib/helpers';
import { Box } from 'grommet';
import { FunctionComponent, useEffect, useState } from 'react';
import React from 'react';
import { useRoom } from 'src/contexts/RoomContext';
import { Whiteboard } from 'src/icons';
import styled from 'styled-components/macro';
import invariant from 'tiny-invariant';

import { CirclePositioner } from './CirclePositioner';
import { Player } from './Player';
import {
  getRandomCornerBend,
  getRandomRotation,
  IRandomStickyNoteData,
} from './StickyNote';

const arrayOfAngles: number[] = [10, 30, 170, 150, 190, 210, 330, 350];
const usedAngles = new Set<number>();

const WhiteboardBackground = styled(Whiteboard)`
  height: 100%;
  width: 100%;
`;

interface IPlayerData {
  angle: number;
  randomData: IRandomStickyNoteData;
}

export const PlayerBackground: FunctionComponent = () => {
  const [allPlayerData, setAllPlayerData] = useState<
    Record<string, IPlayerData>
  >({});

  const { syncedState } = useRoom();
  const players = syncedState?.players ?? {};

  useEffect(() => {
    setAllPlayerData((data) => {
      const clonedData = { ...data };
      for (const playerId of objectKeys(clonedData)) {
        if (!players[playerId]) {
          const playerData = clonedData[playerId];
          usedAngles.delete(playerData.angle);
          delete clonedData[playerId];
        }
      }

      for (const playerId of objectKeys(players)) {
        if (!clonedData[playerId]) {
          const angle = arrayOfAngles.find((angle) => !usedAngles.has(angle));
          invariant(angle, 'Free angle not found');
          usedAngles.add(angle);
          clonedData[playerId] = {
            angle,
            randomData: {
              angle: getRandomRotation(),
              bendAmountLeft: getRandomCornerBend(),
              bendAmountRight: getRandomCornerBend(),
            },
          };
        }
      }

      return clonedData;
    });
  }, [players]);

  const playerBoxes = objectValues(players).map((player) => {
    const playerData = allPlayerData[player.id];
    if (!playerData) {
      return null;
    }

    return (
      <CirclePositioner angle={playerData.angle}>
        <Player
          randomData={playerData.randomData}
          player={player}
          key={player.id}
        />
      </CirclePositioner>
    );
  });

  return (
    <Box
      css={{ position: 'fixed', zIndex: -1 }}
      overflow="hidden"
      fill
      align="center"
      justify="center"
    >
      <WhiteboardBackground preserveAspectRatio="none" />
      {playerBoxes}
    </Box>
  );
};
