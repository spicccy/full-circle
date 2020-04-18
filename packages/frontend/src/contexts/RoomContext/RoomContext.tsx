import { ServerAction } from '@full-circle/shared/lib/actions';
import { clientError } from '@full-circle/shared/lib/actions/client';
import { ROOM_NAME } from '@full-circle/shared/lib/constants';
import { IJoinOptions } from '@full-circle/shared/lib/join/interfaces';
import {
  IRoomMetadata,
  IRoomStateSynced,
  RoomErrorType,
} from '@full-circle/shared/lib/roomState/interfaces';
import React, {
  createContext,
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { useColyseus } from '../ColyseusContext';
import { parseServerError } from './roomErrorHandler';
import {
  empty,
  fail,
  loading,
  RoomState,
  RoomStateWithFn,
  success,
} from './roomStates';

type MessageListener = (message: ServerAction) => void;
type LeaveListener = (code: number) => void;
type RemoveListener = () => void;

interface IRoomContext {
  syncedState?: IRoomStateSynced;
  createAndJoinRoom(): Promise<RoomState>;
  joinRoomByCode(roomId: string, options: IJoinOptions): Promise<RoomState>;
  reconnectToRoomByCode(roomId: string, id: string): Promise<RoomState>;
  reconnectToRoomById(roomId: string, id: string): Promise<RoomState>;
  leaveRoom(): void;
  addMessageListener(listener: MessageListener): RemoveListener;
  addLeaveListener(listener: LeaveListener): RemoveListener;
  clearError(): void;
}

export const RoomContext = createContext<IRoomContext & RoomState>(null as any);

export const useRoom = () => useContext(RoomContext);

export const RoomProvider: FunctionComponent = ({ children }) => {
  const colyseus = useColyseus();
  const [roomState, setRoomState] = useState<RoomState>(empty());
  const [syncedState, setSyncedState] = useState<IRoomStateSynced>();
  const onMessageListeners = useRef(new Set<MessageListener>());
  const onLeaveListeners = useRef(new Set<LeaveListener>());

  const getRoomCode = useCallback(
    async (roomId: string): Promise<string | undefined> => {
      const rooms = await colyseus.getAvailableRooms<IRoomMetadata>();
      const room = rooms.find((r) => r.roomId === roomId);
      return room?.metadata?.roomCode;
    },
    [colyseus]
  );

  const getRoomId = useCallback(
    async (roomCode: string): Promise<string | undefined> => {
      const rooms = await colyseus.getAvailableRooms<IRoomMetadata>();
      const room = rooms.find((r) => r.metadata?.roomCode === roomCode);
      return room?.roomId;
    },
    [colyseus]
  );

  const clearError = useCallback(() => {
    setRoomState(empty());
  }, []);

  const createAndJoinRoom = useCallback(async (): Promise<RoomState> => {
    setRoomState(loading());

    try {
      const room = await colyseus.create<RoomStateWithFn>(ROOM_NAME);
      const roomCode = await getRoomCode(room.id);
      if (!roomCode) {
        const roomState = fail(
          clientError(RoomErrorType.ROOM_INITIALISATION_ERROR)
        );
        setRoomState(roomState);
        return roomState;
      }

      const roomState = success(room, roomCode);
      setRoomState(roomState);
      return roomState;
    } catch (e) {
      const roomState = fail(parseServerError(e));
      setRoomState(roomState);
      return roomState;
    }
  }, [colyseus, getRoomCode]);

  const joinRoomByCode = useCallback(
    async (roomCode: string, options: IJoinOptions): Promise<RoomState> => {
      setRoomState(loading());

      try {
        const roomId = await getRoomId(roomCode);
        if (!roomId) {
          const roomState = fail(clientError(RoomErrorType.ROOM_NOT_FOUND));
          setRoomState(roomState);
          return roomState;
        }

        const room = await colyseus.joinById<RoomStateWithFn>(roomId, options);
        const roomState = success(room, roomCode);
        setRoomState(roomState);
        return roomState;
      } catch (e) {
        const roomState = fail(parseServerError(e));
        setRoomState(roomState);
        return roomState;
      }
    },
    [colyseus, getRoomId]
  );

  const reconnectToRoomByCode = useCallback(
    async (roomCode: string, id: string): Promise<RoomState> => {
      setRoomState(loading());

      try {
        const roomId = await getRoomId(roomCode);
        if (!roomId) {
          const roomState = fail(clientError(RoomErrorType.RECONNECT_ERROR));
          setRoomState(roomState);
          return roomState;
        }

        const room = await colyseus.reconnect<RoomStateWithFn>(roomId, id);
        const roomState = success(room, roomCode);
        setRoomState(roomState);
        return roomState;
      } catch (e) {
        const roomState = fail(parseServerError(e));
        setRoomState(roomState);
        return roomState;
      }
    },
    [colyseus, getRoomId]
  );

  const reconnectToRoomById = useCallback(
    async (roomId: string, sessionId: string): Promise<RoomState> => {
      setRoomState(loading());

      try {
        const room = await colyseus.reconnect<RoomStateWithFn>(
          roomId,
          sessionId
        );

        const roomCode = await getRoomCode(roomId);
        if (!roomCode) {
          const roomState = fail(clientError(RoomErrorType.RECONNECT_ERROR));
          setRoomState(roomState);
          return roomState;
        }

        const roomState = success(room, roomCode);
        setRoomState(roomState);
        return roomState;
      } catch (e) {
        const roomState = fail(parseServerError(e));
        setRoomState(roomState);
        return roomState;
      }
    },
    [colyseus, getRoomCode]
  );

  const leaveRoom = useCallback(() => {
    setRoomState(empty());
  }, []);

  const addMessageListener = useCallback(
    (listener: MessageListener): RemoveListener => {
      onMessageListeners.current.add(listener);
      return () => onMessageListeners.current.delete(listener);
    },
    []
  );

  const addLeaveListener = useCallback(
    (listener: LeaveListener): RemoveListener => {
      onLeaveListeners.current.add(listener);
      return () => onLeaveListeners.current.delete(listener);
    },
    []
  );

  useEffect(() => {
    setSyncedState(roomState.room?.state?.toJSON());
    if (roomState.room) {
      const stateListener = roomState.room.onStateChange((newState) => {
        setSyncedState(newState?.toJSON());
      });

      const messageListener = roomState.room.onMessage((message) => {
        onMessageListeners.current.forEach((listener) => listener(message));
      });

      const leaveListener = roomState.room.onLeave((code) => {
        onLeaveListeners.current.forEach((listener) => listener(code));
      });

      return () => {
        stateListener.clear();
        messageListener.clear();
        leaveListener.clear();
        roomState.room.leave();
      };
    }
  }, [leaveRoom, roomState.room]);

  const context: IRoomContext & RoomState = {
    ...roomState,
    syncedState,
    createAndJoinRoom,
    joinRoomByCode,
    reconnectToRoomByCode,
    reconnectToRoomById,
    leaveRoom,
    clearError,
    addMessageListener,
    addLeaveListener,
  };

  return (
    <RoomContext.Provider value={context}>{children}</RoomContext.Provider>
  );
};
