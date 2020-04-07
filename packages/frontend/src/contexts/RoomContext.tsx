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
  useState,
} from 'react';
import invariant from 'tiny-invariant';

import { useColyseus } from './ColyseusContext';

type RoomStateWithFn = IRoomStateSynced & {
  toJSON(): IRoomStateSynced;
};

export type IRoom = Room<RoomStateWithFn>;

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

interface IRoomContext {
  syncedState?: IRoomStateSynced;
  createAndJoinRoom(): Promise<IRoom | null>;
  joinRoomByCode(roomId: string, options: IJoinOptions): Promise<IRoom | null>;
  leaveRoom(): void;
}

export const RoomContext = createContext<IRoomContext & RoomState>({
  ...getRoomEmptyState(),
  createAndJoinRoom: async () => {
    throw new Error('Uninitialised room');
  },
  joinRoomByCode: async (_roomId: string) => {
    throw new Error('Uninitialised room');
  },
  leaveRoom: () => {
    throw new Error('Uninitialised room');
  },
});

export const useRoom = () => useContext(RoomContext);

export const RoomProvider: FunctionComponent = ({ children }) => {
  const colyseus = useColyseus();
  const [roomState, setRoomState] = useState<RoomState>(getRoomEmptyState());
  const [syncedState, setSyncedState] = useState<IRoomStateSynced>();

  const createAndJoinRoom = useCallback(async (): Promise<IRoom | null> => {
    setRoomState(getRoomLoadingState());

    try {
      const room = await colyseus.create<RoomStateWithFn>(ROOM_NAME);
      const rooms = await colyseus.getAvailableRooms();
      const roomWithMetadata = rooms.find((r) => r.roomId === room.id);
      invariant(roomWithMetadata, 'Unable to find the room we just created');

      setRoomState(
        getRoomSuccessState(room, roomWithMetadata.metadata.roomCode)
      );
      return room;
    } catch (e) {
      setRoomState(getRoomFailureState(e));
      return null;
    }
  }, [colyseus]);

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
          setRoomState(
            getRoomFailureState('Failed to find a room with a matching code')
          );
          return null;
        }

        const { roomId } = matchingRoom;

        const room = await colyseus.joinById<RoomStateWithFn>(roomId, options);

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

  useEffect(() => {
    setSyncedState(roomState.room?.state?.toJSON());
    if (roomState.room) {
      const listener = roomState.room.onStateChange((newState) =>
        setSyncedState(newState?.toJSON())
      );

      const leaveListener = roomState.room.onLeave(leaveRoom);

      return () => {
        listener.clear();
        leaveListener.clear();
        roomState.room?.leave();
      };
    }
  }, [leaveRoom, roomState.room]);

  const context: IRoomContext & RoomState = {
    ...roomState,
    syncedState,
    createAndJoinRoom,
    joinRoomByCode,
    leaveRoom,
  };

  return (
    <RoomContext.Provider value={context}>{children}</RoomContext.Provider>
  );
};
