import 'styled-components/macro';

import { Colour } from '@full-circle/shared/lib/canvas';
import { objectValues } from '@full-circle/shared/lib/helpers';
import { IPlayer } from '@full-circle/shared/lib/roomState';
import { Box, Grommet, Heading, Text } from 'grommet';
import React, { FunctionComponent } from 'react';

import { useRoom } from '../contexts/RoomContext';
import { notepadTheme } from '../styles/notepadTheme';

interface IScoreboardProps {
  players: IPlayer[];
}

const Scoreboard: FunctionComponent<IScoreboardProps> = ({ players }) => {
  const renderScoreboardRows = () => {
    return players
      .sort((a, b) => b.score - a.score)
      .map((player) => {
        return (
          <>
            <Text>{player.username}</Text>
            <Text textAlign="end">{player.score}</Text>
            <Text textAlign="end">{player.votes}</Text>
          </>
        );
      });
  };

  return (
    <div
      css={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr',
        paddingBottom: 24,
      }}
    >
      <Text size="large">Player</Text>
      <Text size="large" textAlign="end">
        Score
      </Text>
      <Text size="large" textAlign="end">
        Votes
      </Text>
      {renderScoreboardRows()}
    </div>
  );
};

const ScoreboardPage: FunctionComponent = () => {
  const { syncedState } = useRoom();

  if (!syncedState) {
    return null;
  }
  const players = objectValues(syncedState.playerManager.playerMap);

  return (
    <Grommet theme={notepadTheme}>
      <Box
        flex
        width="medium"
        pad="small"
        round="small"
        elevation="medium"
        background="white"
        border={{
          color: Colour.BLUE,
          size: 'medium',
          side: 'all',
          style: 'solid',
        }}
      >
        <Heading level="2" textAlign="center">
          Scoreboard
        </Heading>
        <Scoreboard players={players} />
      </Box>
    </Grommet>
  );
};

export { Scoreboard, ScoreboardPage };
