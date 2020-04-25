import { joinGame } from '@full-circle/shared/lib/actions/client';
import { joinGameError } from '@full-circle/shared/lib/actions/server';
import { objectValues } from '@full-circle/shared/lib/helpers';
import { PhaseType } from '@full-circle/shared/lib/roomState';
import { Box } from 'grommet';
import React, { FunctionComponent, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import { useRoom } from 'src/contexts/RoomContext';
import { useRoomMessage } from 'src/hooks/useRoomListeners';
import invariant from 'tiny-invariant';
import { getType } from 'typesafe-actions';

import { Background } from '../components/Background';
import { CuratorReconnectCard } from './CuratorReconnectCard';
import { JoinGameCard } from './JoinGameCard';
import { ReconnectCard } from './ReconnectCard';

const JoinGamePage: FunctionComponent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    sendAction,
    syncedState,
    roomCode,
    room,
    reconnectToRoomById,
  } = useRoom();
  const history = useHistory();
  const { addToast } = useToasts();

  invariant(room && syncedState, 'Room and state should exist');

  const handleJoinGame = (username: string) => {
    setIsLoading(true);
    sendAction(joinGame({ username }));
  };

  const handleCuratorReconnect = async () => {
    setIsLoading(true);
    const roomState = await reconnectToRoomById(room.id, syncedState.curator);
    setIsLoading(false);

    if (roomState.room) {
      history.push(`/curator/${roomState.roomCode}`);
    }
  };

  const handleReconnect = async (clientId: string) => {
    setIsLoading(true);
    await reconnectToRoomById(room.id, clientId);
    setIsLoading(false);
  };

  useRoomMessage((msg) => {
    switch (msg.type) {
      case getType(joinGameError): {
        addToast(msg.payload, { appearance: 'error' });
        setIsLoading(false);
      }
    }
  });

  const renderBody = () => {
    if (syncedState?.phase.phaseType === PhaseType.LOBBY) {
      return (
        <Box width="medium">
          <JoinGameCard
            onJoinGame={handleJoinGame}
            roomCode={roomCode}
            isLoading={isLoading}
          />
        </Box>
      );
    }

    const disconnectedPlayers = objectValues(
      syncedState.playerManager.playerMap ?? {}
    ).filter((player) => player.disconnected);

    return (
      <Box width="medium">
        <ReconnectCard
          disconnectedPlayers={disconnectedPlayers}
          roomCode={roomCode}
          isLoading={isLoading}
          onReconnect={handleReconnect}
        />
      </Box>
    );
  };

  return (
    <Background>
      {renderBody()}
      {syncedState.curatorDisconnected && (
        <Box width="medium" margin={{ top: 'small' }}>
          <CuratorReconnectCard
            isLoading={isLoading}
            onCuratorReconnect={handleCuratorReconnect}
          />
        </Box>
      )}
    </Background>
  );
};

export { JoinGamePage };
