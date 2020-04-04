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

interface IRoomSuccessState {
  isLoading: false;
  room?: IRoom;
  roomError: undefined;
  roomCode: string;
}

interface IRoomFailureState {
  isLoading: false;
  room: undefined;
  roomError: string;
  roomCode: undefined;
}

type RoomState = IRoomLoadingState | IRoomSuccessState | IRoomFailureState;

const defaultRoomState: RoomState = {
  isLoading: false,
  room: undefined,
  roomError: 'Uninitialised room',
  roomCode: undefined,
};

interface IRoomContext {
  syncedState?: IRoomStateSynced;
  createAndJoinRoom(): Promise<IRoom | null>;
  joinRoomByCode(roomId: string, options: IJoinOptions): Promise<IRoom | null>;
  leaveRoom(): void;
}

export const RoomContext = createContext<IRoomContext & RoomState>({
  ...defaultRoomState,
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
  const [roomState, setRoomState] = useState<RoomState>(defaultRoomState);
  const [syncedState, setSyncedState] = useState<IRoomStateSynced>();

  const createAndJoinRoom = useCallback(async (): Promise<IRoom | null> => {
    setRoomState({
      isLoading: true,
      room: undefined,
      roomError: undefined,
      roomCode: undefined,
    });

    try {
      const room = await colyseus.create<RoomStateWithFn>(ROOM_NAME);
      const rooms = await colyseus.getAvailableRooms();
      const roomWithMetadata = rooms.find((r) => r.roomId === room.id);
      invariant(roomWithMetadata, 'Unable to find the room we just created');

      setRoomState({
        isLoading: false,
        room,
        roomError: undefined,
        roomCode: roomWithMetadata.metadata.roomCode,
      });
      return room;
    } catch (e) {
      setRoomState({
        isLoading: false,
        room: undefined,
        roomError: e.message,
        roomCode: undefined,
      });
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
          setRoomState({
            isLoading: false,
            room: undefined,
            roomError: 'Failed to find a room with a matching code',
            roomCode: undefined,
          });
          return null;
        }

        const { roomId } = matchingRoom;

        const room = await colyseus.joinById<RoomStateWithFn>(roomId, options);

        setRoomState({
          isLoading: false,
          room,
          roomError: undefined,
          roomCode,
        });
        return room;
      } catch (e) {
        setRoomState({
          isLoading: false,
          room: undefined,
          roomError: e.message,
          roomCode: undefined,
        });
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

      return () => {
        listener.clear();
        roomState.room?.leave();
      };
    }
  }, [roomState.room]);

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
