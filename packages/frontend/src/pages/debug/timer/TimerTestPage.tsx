import React, {
  FunctionComponent,
  useCallback,
  useState,
  useEffect,
} from 'react';
import { Box, Heading, Paragraph, Button } from 'grommet';
import { useHistory, Redirect } from 'react-router-dom';
import { useRoom } from '../../../contexts/RoomContext';
import { usePhaseTimer } from '../../../hooks/usePhaseTimer';

const TimerTest: FunctionComponent = () => {
  const history = useHistory();
  const { room } = useRoom();
  const msTimer = usePhaseTimer();
  const [users, setUsers] = useState<string[] | null>(null);
  const [onStateChange, setOnStateChange] = useState<any>(null);

  const createUserTiles = (usernames: string[]): JSX.Element[] => {
    return usernames.map(name => <div>{name}</div>);
  };

  const advanceClientToGame = useCallback(() => {
    // TODO: notify the backend that this player is 'ready'.
    // When all players are ready,
    // everyone should be redirected to the game screen.
    // The backend will then update its 'phase' as well.

    // Redirects client to the game screen.
    history.push('/play');
  }, [history]);

  const createUserTilesCallback = useCallback(createUserTiles, [users]);

  useEffect(() => {
    if (!onStateChange && room) {
      const stateListeners = room.onStateChange(state => {
        const usernames = Object.values(state.players).map(
          (user: any) => user.username
        );
        setUsers(usernames);
      });
      setOnStateChange(stateListeners);
    }
    return () => {
      if (onStateChange) {
        onStateChange.remove();
      }
    };
  }, [onStateChange, room]);

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
            {users ? createUserTilesCallback(users) : <></>}
            <br />
            <Button onClick={advanceClientToGame} label="Skip to the Game" />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export { TimerTest };
