import { notifyPlayerReady } from '@full-circle/shared/lib/actions/client';
import { IPlayer } from '@full-circle/shared/lib/roomState/interfaces';
import { Box, Button, Heading, Paragraph } from 'grommet';
import React, {
  FunctionComponent,
  ReactNode,
  useCallback,
  useMemo,
} from 'react';
import { Redirect } from 'react-router-dom';
import { objectValues } from 'src/helpers';
import { useRoomState } from 'src/hooks/useRoomState';
import invariant from 'tiny-invariant';

import { useRoom } from '../../../contexts/RoomContext';
import { usePhaseTimer } from '../../../hooks/usePhaseTimer';

const TimerTest: FunctionComponent = () => {
  const { room } = useRoom();

  const msTimer = usePhaseTimer();
  const players = useRoomState()?.players;

  const readyPlayer = useCallback(() => {
    invariant(room, 'No valid room found!');
    room.send(notifyPlayerReady());
  }, [room]);

  const userTiles = useMemo((): ReactNode => {
    const users = players
      ? objectValues(players).map((user: IPlayer) => user.username)
      : null;

    if (users) {
      return users.map((name) => <div>{name}</div>);
    }

    return null;
  }, [players]);

  if (!room) {
    return <Redirect to="/" />;
  }

  if (msTimer && msTimer < 0) {
    readyPlayer();
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
            {userTiles}
            <br />
            <Button onClick={readyPlayer} label="Skip to the Game" />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export { TimerTest };
