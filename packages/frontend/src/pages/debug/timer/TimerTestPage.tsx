import React, { FunctionComponent, useCallback, useMemo } from 'react';
import { Box, Heading, Paragraph, Button } from 'grommet';
import { useHistory, Redirect } from 'react-router-dom';
import { useRoom } from '../../../contexts/RoomContext';
import { usePhaseTimer } from '../../../hooks/usePhaseTimer';
import { useRoomState } from 'src/hooks/useRoomState';
import { objectValues } from 'src/helpers';
import { IPlayer } from '@full-circle/shared/lib/roomState/interfaces';

const TimerTest: FunctionComponent = () => {
  const history = useHistory();
  const { room } = useRoom();
  const msTimer = usePhaseTimer();
  const players = useRoomState()?.players;

  const advanceClientToGame = useCallback(() => {
    // TODO: notify the backend that this player is 'ready'.
    // When all players are ready,
    // everyone should be redirected to the game screen.
    // The backend will then update its 'phase' as well.

    // Redirects client to the game screen.
    history.push('/play');
  }, [history]);

  const UserTiles = useMemo((): JSX.Element[] | null => {
    const users = players
      ? objectValues(players).map((user: IPlayer) => user.username)
      : null;

    if (users) {
      return users.map(name => <div>{name}</div>);
    }

    return null;
  }, [players]);

  if (!room) {
    return <Redirect to="/" />;
  }

  if (msTimer && msTimer < 0) {
    advanceClientToGame();
  }

  return (
    <Box background="light-2" fill>
      <Box align="center" justify="start">
        <Box width="medium" align="center">
          <Heading>Timer Test Page</Heading>
          <Box align="center">
            <Paragraph>ID:{room.id}</Paragraph>
            <Paragraph>Welcome to the Lobby ya filthy animal.</Paragraph>
            <Paragraph>
              For now, when the timer reaches 0, you will be automaticall
              transferred to the game page. Click the button below to be
              redirected early.
            </Paragraph>
            <Paragraph>{msTimer ?? 'Getting Room State'}</Paragraph>
            <h1>Joined Users:</h1>
            {UserTiles}
            <br />
            <Button onClick={advanceClientToGame} label="Skip to the Game" />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export { TimerTest };
