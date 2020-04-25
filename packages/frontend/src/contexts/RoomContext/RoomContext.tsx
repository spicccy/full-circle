import { ClientAction, ServerAction } from '@full-circle/shared/lib/actions';
import { ROOM_NAME } from '@full-circle/shared/lib/constants';
import { RoomSettings } from '@full-circle/shared/lib/roomSettings';
import {
  IRoomMetadata,
  IRoomStateSynced,
  RoomError,
} from '@full-circle/shared/lib/roomState';
import React, {
  createContext,
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  LocalStorageKey,
  removeStorage,
  setStorage,
} from 'src/utils/localStorage';

import { useColyseus } from '../ColyseusContext';
import { parseRoomError } from './roomErrorHandler';
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
  createAndJoinRoom(roomSettings?: RoomSettings): Promise<RoomState>;
  joinRoomByCode(roomId: string): Promise<RoomState>;
  reconnectToRoomById(roomId: string, id: string): Promise<RoomState>;
  leaveRoom(clearSession?: boolean): void;
  sendAction(action: ClientAction): void;
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

  const createAndJoinRoom = useCallback(
    async (options?: RoomSettings): Promise<RoomState> => {
      setRoomState(loading());

      try {
        const room = await colyseus.create<RoomStateWithFn>(ROOM_NAME, options);
        const roomCode = await getRoomCode(room.id);
        if (!roomCode) {
          const roomState = fail(RoomError.ROOM_INITIALISATION_ERROR);
          setRoomState(roomState);
          return roomState;
        }

        const roomState = success(room, roomCode);
        setRoomState(roomState);
        setStorage(LocalStorageKey.SESSION_DATA, {
          roomCode,
          clientId: room.sessionId,
          roomId: room.id,
          isCurator: true,
        });

        return roomState;
      } catch (e) {
        const roomState = fail(parseRoomError(e));
        setRoomState(roomState);
        return roomState;
      }
    },
    [colyseus, getRoomCode]
  );

  const joinRoomByCode = useCallback(
    async (roomCode: string): Promise<RoomState> => {
      setRoomState(loading());

      try {
        const roomId = await getRoomId(roomCode);
        if (!roomId) {
          const roomState = fail(RoomError.ROOM_NOT_FOUND);
          setRoomState(roomState);
          return roomState;
        }

        const room = await colyseus.joinById<RoomStateWithFn>(roomId);
        const roomState = success(room, roomCode);
        setRoomState(roomState);
        setStorage(LocalStorageKey.SESSION_DATA, {
          roomCode,
          clientId: room.sessionId,
          roomId: room.id,
          isCurator: false,
        });

        return roomState;
      } catch (e) {
        const roomState = fail(parseRoomError(e));
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
          const roomState = fail(RoomError.ROOM_INITIALISATION_ERROR);
          setRoomState(roomState);
          return roomState;
        }

        const roomState = success(room, roomCode);
        setRoomState(roomState);
        setStorage(LocalStorageKey.SESSION_DATA, {
          roomCode,
          clientId: room.sessionId,
          roomId: room.id,
          isCurator: false,
        });

        return roomState;
      } catch (e) {
        const roomState = fail(parseRoomError(e));
        setRoomState(roomState);
        return roomState;
      }
    },
    [colyseus, getRoomCode]
  );

  const leaveRoom = useCallback((clearSession = true) => {
    setRoomState(empty());
    if (clearSession) {
      removeStorage(LocalStorageKey.SESSION_DATA);
    }
  }, []);

  const sendAction = (action: ClientAction) => {
    roomState.room?.send(action);
  };

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
    reconnectToRoomById,
    leaveRoom,
    sendAction,
    clearError,
    addMessageListener,
    addLeaveListener,
  };

  return (
    <RoomContext.Provider value={context}>{children}</RoomContext.Provider>
  );
};
