import { PhaseType } from '@full-circle/shared/lib/roomState/constants';
import { RoomErrorType } from '@full-circle/shared/lib/roomState/interfaces';
import { Box, Heading } from 'grommet';
import { Home } from 'grommet-icons';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useToasts } from 'react-toast-notifications';
import { LoadingButton } from 'src/components/Button/LoadingButton';
import { Card } from 'src/components/Card/Card';
import { LinkButton } from 'src/components/Link/LinkButton';
import { useRoom } from 'src/contexts/RoomContext';
import { useRoomLeave } from 'src/hooks/useRoomListeners';
import {
  getStorage,
  LocalStorageKey,
  removeStorage,
  setStorage,
} from 'src/utils/localStorage';

import { Background } from './components/Background';

export const ReconnectManager: FunctionComponent = ({ children }) => {
  const {
    room,
    syncedState,
    isLoading,
    roomError,
    reconnectToRoomById,
    leaveRoom,
    clearError,
  } = useRoom();
  const [reconnecting, setReconnecting] = useState(true);

  const { addToast } = useToasts();

  const reconnectToRoom = async () => {
    const sessionId = getStorage(LocalStorageKey.SESSION_ID);
    const roomId = getStorage(LocalStorageKey.ROOM_ID);
    if (sessionId && roomId) {
      await reconnectToRoomById(roomId, sessionId);
    } else {
      setReconnecting(false);
    }
  };

  useEffect(() => {
    if (room) {
      setReconnecting(false);
    }
  }, [room]);

  useEffect(() => {
    if (room || isLoading) {
      setReconnecting(false);
    } else {
      reconnectToRoom();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (reconnecting && roomError) {
      clearError();

      switch (roomError.payload) {
        case RoomErrorType.NETWORK_ERROR: {
          addToast('Failed to reconnect. Try again', { appearance: 'error' });
          break;
        }

        default: {
          addToast(roomError.payload, { appearance: 'error' });
          setReconnecting(false);
          removeStorage(LocalStorageKey.SESSION_ID);
          removeStorage(LocalStorageKey.ROOM_ID);
        }
      }
    }
  }, [addToast, clearError, reconnectToRoomById, reconnecting, roomError]);

  // Add current room ids to localstorage
  useEffect(() => {
    const currentPhase = syncedState?.phase.phaseType;
    if (room && currentPhase && currentPhase !== PhaseType.LOBBY) {
      setStorage(LocalStorageKey.SESSION_ID, room.sessionId);
      setStorage(LocalStorageKey.ROOM_ID, room.id);
    }
  }, [room, syncedState]);

  useRoomLeave((code) => {
    switch (code) {
      case 1000: {
        // 1000 room close
        addToast('Room has been closed', { appearance: 'error' });
        removeStorage(LocalStorageKey.SESSION_ID);
        removeStorage(LocalStorageKey.ROOM_ID);
        setReconnecting(false);
        leaveRoom();
        return;
      }
      case 1006: {
        // 1006 disconnect
        addToast('You have been disconnected.', {
          appearance: 'error',
        });
        setReconnecting(true);
        return;
      }
      default: {
        addToast(`You have been disconnected (${code})`, {
          appearance: 'error',
        });
        removeStorage(LocalStorageKey.SESSION_ID);
        removeStorage(LocalStorageKey.ROOM_ID);
        setReconnecting(false);
        leaveRoom();
        return;
      }
    }
  });

  if (!reconnecting) {
    return <>{children}</>;
  }

  return (
    <Background>
      <Box width="medium">
        <Card pad="medium">
          <Heading textAlign="center">You have been disconnected!</Heading>
          <LoadingButton
            size="large"
            margin="small"
            loading={isLoading}
            disabled={isLoading}
            onClick={reconnectToRoom}
            label={isLoading ? 'Reconnecting' : 'Reconnect'}
          />
          <LinkButton
            size="large"
            margin="small"
            href="/"
            onClick={leaveRoom}
            label="Go home"
            icon={<Home />}
          />
        </Card>
      </Box>
    </Background>
  );
};
