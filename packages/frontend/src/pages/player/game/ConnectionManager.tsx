import { RoomError } from '@full-circle/shared/lib/roomState';
import { Box, Button, Heading } from 'grommet';
import { Home } from 'grommet-icons';
import React, { FunctionComponent, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import { Card } from 'src/components/Card/Card';
import { LinkButton } from 'src/components/Link/LinkButton';
import { useRoom } from 'src/contexts/RoomContext';
import { useRoomLeave } from 'src/hooks/useRoomListeners';
import {
  getStorage,
  LocalStorageKey,
  removeStorage,
} from 'src/utils/localStorage';

import { Background } from './components/Background';

interface IParamProps {
  roomCode: string;
}

export const ConnectionManager: FunctionComponent = ({ children }) => {
  const {
    room,
    roomError,
    isLoading,
    joinRoomByCode,
    reconnectToRoomById,
    leaveRoom,
    clearError,
  } = useRoom();
  const { addToast } = useToasts();
  const history = useHistory();
  const params = useParams<IParamProps>();

  useEffect(() => {
    // If user joins room via URL, should automatically join or reconnect
    // If user joins via login, room should already exist
    const init = async () => {
      if (!room) {
        const sessionData = getStorage(LocalStorageKey.SESSION_DATA);
        if (
          sessionData?.roomCode === params.roomCode &&
          !sessionData.isCurator
        ) {
          await reconnectToRoomById(sessionData.roomId, sessionData.clientId);
        } else {
          await joinRoomByCode(params.roomCode);
        }
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Handle errors when joining room
    if (roomError) {
      clearError();

      switch (roomError) {
        case RoomError.NETWORK_ERROR: {
          addToast(roomError, { appearance: 'error' });
          break;
        }

        case RoomError.RECONNECT_ERROR: {
          joinRoomByCode(params.roomCode);
          break;
        }

        default: {
          addToast(roomError, { appearance: 'error' });
          removeStorage(LocalStorageKey.SESSION_DATA);
          history.push('/');
        }
      }
    }
  }, [
    addToast,
    clearError,
    history,
    joinRoomByCode,
    params.roomCode,
    roomError,
  ]);

  useRoomLeave((code) => {
    switch (code) {
      case 1000: {
        // 1000 room close
        addToast('Room has been closed', { appearance: 'error' });
        leaveRoom();
        history.push('/');
        return;
      }
      case 1006: {
        // 1006 disconnect
        addToast('You have been disconnected.', {
          appearance: 'error',
        });
        leaveRoom(false);
        return;
      }
      default: {
        addToast(`You have been disconnected (${code})`, {
          appearance: 'error',
        });
        leaveRoom();
        history.push('/');
        return;
      }
    }
  });

  if (room) {
    return <>{children}</>;
  }

  if (isLoading) {
    return <Background />;
  }

  const renderReconnect = () => {
    const sessionData = getStorage(LocalStorageKey.SESSION_DATA);
    if (sessionData) {
      return (
        <Button
          size="large"
          margin="small"
          onClick={() =>
            reconnectToRoomById(sessionData.roomId, sessionData.clientId)
          }
          label={isLoading ? 'Reconnecting' : 'Reconnect'}
        />
      );
    }

    return null;
  };

  return (
    <Background>
      <Box width="medium">
        <Card pad="medium">
          <Heading textAlign="center">You have been disconnected!</Heading>
          {renderReconnect()}
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
