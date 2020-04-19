import 'styled-components/macro';

import { IPlayer } from '@full-circle/shared/lib/roomState';
import { Box, Grommet, Heading, Text } from 'grommet';
import React, { FunctionComponent } from 'react';

import { useRoom } from '../contexts/RoomContext';
import { notepadTheme } from '../styles/notepadTheme';

const Scoreboard: FunctionComponent = () => {
  const { syncedState } = useRoom();

  if (!syncedState) {
    return null;
  }
  const players = syncedState.playerManager.playerMap;

  const playerScores: IPlayer[] = [];

  for (const id in syncedState.playerManager.playerMap) {
    const player: IPlayer = players[id];
    playerScores.push(player);
  }

  const renderScoreboardRows = () => {
    return playerScores
      .sort((a, b) => b.score - a.score)
      .map((player) => {
        return (
          <div
            css={{
              display: 'flex',
              width: '100%',
              justifyContent: 'space-between',
            }}
          >
            <Text>{player.username}</Text>
            <Text>{player.score}</Text>
          </div>
        );
      });
  };

  return (
    <Grommet theme={notepadTheme}>
      <Box flex width="medium" pad="small" round="small" elevation="medium">
        <Heading level="3" textAlign="center">
          Scoreboard
        </Heading>
        {renderScoreboardRows()}
      </Box>
    </Grommet>
  );
};

export { Scoreboard };
