import { RECONNECT_COMMAND } from '@full-circle/shared/lib/join/interfaces';
import { Warning } from '@full-circle/shared/lib/roomState/interfaces';
import { Box, Text } from 'grommet';
import React, {
  FunctionComponent,
  Reducer,
  useEffect,
  useReducer,
  useState,
} from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import { LinkAnchor } from 'src/components/Link/LinkAnchor';
import { RoomErrors, useRoom } from 'src/contexts/RoomContext';

import { LoginCard } from './LoginCard';

interface ILoginPageParams {
  roomCode?: string;
}

type LoginPageErrorState = {
  username: boolean;
  roomCode: boolean;
  connection: boolean;
};

const initialErrorState: LoginPageErrorState = {
  username: false,
  roomCode: false,
  connection: false,
};

type ErrorAction =
  | { type: 'setError'; on: keyof LoginPageErrorState }
  | { type: 'clearError'; on: keyof LoginPageErrorState };

type ErrorReducer = Reducer<LoginPageErrorState, ErrorAction>;

const errorReducer: ErrorReducer = (currState, action) => {
  switch (action.type) {
    case 'setError':
      currState[action.on] = true;
      return { ...currState };
    case 'clearError':
      currState[action.on] = false;
      return { ...currState };
  }
};

const LoginPage: FunctionComponent = () => {
  const {
    room,
    joinRoomByCode,
    roomError,
    reconnectToRoomByCode,
    clearError,
  } = useRoom();
  const params = useParams<ILoginPageParams>();

  const [name, setName] = useState(localStorage.getItem('username') ?? '');
  const [roomCode, setRoomCode] = useState(params.roomCode ?? '');

  const [errorState, dispatchError] = useReducer<ErrorReducer>(
    errorReducer,
    initialErrorState
  );

  const { addToast, removeToast, toastStack } = useToasts();

  useEffect(() => {
    if (roomError) {
      const errorMsg = roomError;
      clearError(); // stops the below switch from executing infinitely
      switch (errorMsg) {
        case Warning.CONFLICTING_USERNAMES:
          dispatchError({ type: 'setError', on: 'username' });
          localStorage.removeItem('username');
          setName('');
          break;
        case RoomErrors.NO_MATCHING_ROOMS:
          dispatchError({ type: 'setError', on: 'roomCode' });
          setRoomCode('');
          break;
      }

      if (errorMsg.startsWith(RECONNECT_COMMAND)) {
        const id = errorMsg.split(':')[1];
        let toastId = '';
        addToast(
          'Reconnecting to room',
          {
            appearance: 'info',
          },
          (id) => {
            toastId = id;
          }
        );
        reconnectToRoomByCode(roomCode, id).then((_room) => {
          removeToast(toastId);
          addToast('Reconnected!', { appearance: 'success' });
        });
      } else {
        addToast(errorMsg, { appearance: 'error' });
      }
    }
  }, [
    addToast,
    clearError,
    reconnectToRoomByCode,
    removeToast,
    roomCode,
    roomError,
  ]);

  const attemptToJoinRoom = async () => {
    localStorage.setItem('username', name);
    await joinRoomByCode(roomCode, { username: name });
  };

  if (room) {
    return <Redirect to="/play" />;
  }

  return (
    <Box
      background="dark-1"
      flex
      height={{ min: '100vh' }}
      align="center"
      justify="center"
      pad="medium"
    >
      <Box width="medium" margin={{ bottom: 'medium' }}>
        <LoginCard
          name={name}
          setName={(name: string) => {
            dispatchError({ type: 'clearError', on: 'username' });
            setName(name);
          }}
          roomCode={roomCode}
          setRoomCode={(code: string) => {
            dispatchError({ type: 'clearError', on: 'roomCode' });
            setRoomCode(code);
          }}
          attemptToJoinRoom={attemptToJoinRoom}
          usernameError={errorState.username}
          roomCodeError={errorState.roomCode}
        />
      </Box>
      <Text>
        OR create a new game{' '}
        <LinkAnchor data-testid="newGame" href="/create">
          here
        </LinkAnchor>
      </Text>
    </Box>
  );
};

export { LoginPage };
