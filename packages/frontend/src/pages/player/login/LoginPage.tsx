import { clientError } from '@full-circle/shared/lib/actions/client';
import { reconnect, warn } from '@full-circle/shared/lib/actions/server';
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
import { useRoom } from 'src/contexts/RoomContext';
import { getType } from 'typesafe-actions';

import { Background } from '../game/components/Background';
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

  const { addToast, removeToast } = useToasts();

  useEffect(() => {
    if (roomError) {
      const errorMsg = roomError;
      clearError(); // stops the below switch from executing infinitely

      let dismissableToastId = '';

      switch (errorMsg.type) {
        case getType(clientError):
          addToast(errorMsg.payload, { appearance: 'error' });
          break;
        case getType(reconnect):
          addToast(
            `Reconnecting to ${roomCode}`,
            { appearance: 'info' },
            (id) => (dismissableToastId = id)
          );
          reconnectToRoomByCode(roomCode, errorMsg.payload).then((_room) => {
            removeToast(dismissableToastId);
            addToast('Reconnected!', { appearance: 'success' });
          });
          break;
        case getType(warn):
          addToast(errorMsg.payload, { appearance: 'error' });
          break;
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
    <Background>
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
    </Background>
  );
};

export { LoginPage };
