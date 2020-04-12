import { ServerAction } from '@full-circle/shared/lib/actions';
import { ROOM_NAME } from '@full-circle/shared/lib/constants';
import { IJoinOptions } from '@full-circle/shared/lib/join/interfaces';
import {
  IRoomMetadata,
  IRoomStateSynced,
} from '@full-circle/shared/lib/roomState/interfaces';
import { Room } from 'colyseus.js';
import React, {
  createContext,
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import invariant from 'tiny-invariant';

import { useColyseus } from './ColyseusContext';

type RoomStateWithFn = IRoomStateSynced & {
  toJSON(): IRoomStateSynced;
};

export type IRoom = Room<RoomStateWithFn>;

export enum RoomErrors {
  INITIALISATION_ERROR = 'Unable to initialise the room',
  NO_MATCHING_ROOMS = 'Failed to find a room with a matching code',
}

interface IRoomLoadingState {
  isLoading: true;
  room: undefined;
  roomError: undefined;
  roomCode: undefined;
}

interface IRoomEmptyState {
  isLoading: false;
  room: undefined;
  roomError: undefined;
  roomCode: undefined;
}

interface IRoomSuccessState {
  isLoading: false;
  room: IRoom;
  roomError: undefined;
  roomCode: string;
}

interface IRoomFailureState {
  isLoading: false;
  room: undefined;
  roomError: string;
  roomCode: undefined;
}

type RoomState =
  | IRoomLoadingState
  | IRoomEmptyState
  | IRoomSuccessState
  | IRoomFailureState;

const getRoomEmptyState = (): IRoomEmptyState => ({
  isLoading: false,
  room: undefined,
  roomCode: undefined,
  roomError: undefined,
});

const getRoomLoadingState = (): IRoomLoadingState => ({
  isLoading: true,
  room: undefined,
  roomCode: undefined,
  roomError: undefined,
});

const getRoomSuccessState = (
  room: IRoom,
  roomCode: string
): IRoomSuccessState => ({
  isLoading: false,
  room,
  roomCode,
  roomError: undefined,
});

const getRoomFailureState = (roomError: string): IRoomFailureState => ({
  isLoading: false,
  room: undefined,
  roomCode: undefined,
  roomError,
});

type MessageListener = (message: ServerAction) => void;
type LeaveListener = (code: number) => void;
type RemoveListener = () => void;

interface IRoomContext {
  syncedState?: IRoomStateSynced;
  createAndJoinRoom(): Promise<IRoom | null>;
  joinRoomByCode(roomId: string, options: IJoinOptions): Promise<IRoom | null>;
  reconnectToRoomByCode(roomId: string, id: string): Promise<IRoom | null>;
  leaveRoom(): void;
  addMessageListener(listener: MessageListener): RemoveListener;
  addLeaveListener(listener: LeaveListener): RemoveListener;
  clearError(): void;
}

export const RoomContext = createContext<IRoomContext & RoomState>(null as any);

export const useRoom = () => useContext(RoomContext);

export const RoomProvider: FunctionComponent = ({ children }) => {
  const colyseus = useColyseus();
  const [roomState, setRoomState] = useState<RoomState>(getRoomEmptyState());
  const [syncedState, setSyncedState] = useState<IRoomStateSynced>();
  const onMessageListeners = useRef(new Set<MessageListener>());
  const onLeaveListeners = useRef(new Set<LeaveListener>());

  const createAndJoinRoom = useCallback(async (): Promise<IRoom | null> => {
    setRoomState(getRoomLoadingState());

    try {
      const room = await colyseus.create<RoomStateWithFn>(ROOM_NAME);
      const rooms = await colyseus.getAvailableRooms();
      const roomWithMetadata = rooms.find((r) => r.roomId === room.id);
      if (!roomWithMetadata) {
        setRoomState(getRoomFailureState(RoomErrors.INITIALISATION_ERROR));
        return null;
      }

      setRoomState(
        getRoomSuccessState(room, roomWithMetadata.metadata.roomCode)
      );

      return room;
    } catch (e) {
      setRoomState(getRoomFailureState(e));
      return null;
    }
  }, [colyseus]);

  const clearError = useCallback(() => {
    setRoomState({
      isLoading: true,
      room: undefined,
      roomError: undefined,
      roomCode: undefined,
    });
  }, []);

  const joinRoomByCode = useCallback(
    async (roomCode: string, options: IJoinOptions): Promise<IRoom | null> => {
      setRoomState({
        isLoading: true,
        room: undefined,
        roomError: undefined,
        roomCode: undefined,
      });

      try {
        const rooms = await colyseus.getAvailableRooms<IRoomMetadata>(
          ROOM_NAME
        );
        const matchingRoom = rooms.find(
          (room) => room.metadata?.roomCode === roomCode
        );

        if (!matchingRoom) {
          setRoomState(getRoomFailureState(RoomErrors.NO_MATCHING_ROOMS));
          return null;
        }

        const { roomId } = matchingRoom;

        const room = await colyseus.joinById<RoomStateWithFn>(roomId, options);

        setRoomState(getRoomSuccessState(room, roomCode));
        return room;
      } catch (e) {
        console.log(typeof e);
        console.log('ERROR here', e);
        setRoomState(getRoomFailureState(e));
        return null;
      }
    },
    [colyseus]
  );

  const reconnectToRoomByCode = useCallback(
    async (roomCode: string, id: string): Promise<IRoom | null> => {
      setRoomState({
        isLoading: true,
        room: undefined,
        roomError: undefined,
        roomCode: undefined,
      });

      try {
        const rooms = await colyseus.getAvailableRooms<IRoomMetadata>(
          ROOM_NAME
        );
        const matchingRoom = rooms.find(
          (room) => room.metadata?.roomCode === roomCode
        );

        if (!matchingRoom) {
          setRoomState(getRoomFailureState(RoomErrors.NO_MATCHING_ROOMS));
          return null;
        }

        const { roomId } = matchingRoom;

        const room = await colyseus.reconnect<RoomStateWithFn>(roomId, id);

        setRoomState(getRoomSuccessState(room, roomCode));
        return room;
      } catch (e) {
        setRoomState(getRoomFailureState(e));
        return null;
      }
    },
    [colyseus]
  );

  const leaveRoom = useCallback(() => {
    setRoomState({
      isLoading: false,
      room: undefined,
      roomError: '',
      roomCode: undefined,
    });
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

      const leaveListener = roomState.room.onLeave((message) => {
        onLeaveListeners.current.forEach((listener) => listener(message));
        leaveRoom();
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
    leaveRoom,
    clearError,
    addMessageListener,
    addLeaveListener,
  };

  return (
    <RoomContext.Provider value={context}>{children}</RoomContext.Provider>
  );
};
