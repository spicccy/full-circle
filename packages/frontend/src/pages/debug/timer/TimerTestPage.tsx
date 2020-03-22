import React, {
  FunctionComponent,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { Box, Heading, Paragraph, Button } from 'grommet';
import { useHistory, Redirect } from 'react-router-dom';
import { useRoomState } from '../../../hooks/useRoomState';
import { useRoom } from '../../../contexts/RoomContext';

const TimerTest: FunctionComponent = () => {
  const history = useHistory();
  const { room } = useRoom();
  const roomState = useRoomState();

  const [msTimer, setMsTimer] = useState(0);

  const advanceClientToGame = useCallback(() => {
    // TODO: notify the backend that this player is 'ready'.
    // When all players are ready,
    // everyone should be redirected to the game screen.

    // Redirects client to the game screen.
    history.push('/play');
  }, [history]);

  const updateTimer = useCallback(() => {
    if (roomState) {
      const timerLength = roomState.phase.phaseEnd - Date.now();
      if (timerLength <= 0) {
        advanceClientToGame();
      }
      setMsTimer(timerLength);
    }
  }, [roomState, setMsTimer, advanceClientToGame]);

  useEffect(() => {
    if (roomState) {
      const ticker = setInterval(updateTimer, 500);
      return () => {
        clearInterval(ticker);
      };
    }
  }, [roomState, updateTimer]);

  if (!room) {
    return <Redirect to="/" />;
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
              For now, nothing interesting happens here. Look at ominous timer
              on this page and hope it doesn't get to 0. Who knows what will
              happen when it does? (Certainly not us devs: we still need to
              implement phase transitions). But notice how synchronised the
              timer is with all your friends! Wonderful isn't it? :)
            </Paragraph>
            <Paragraph>
              {roomState ? Math.round(msTimer / 1000) : 'Getting Room State'}
            </Paragraph>
            <Button onClick={advanceClientToGame} label="Skip to the Game" />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export { TimerTest };
