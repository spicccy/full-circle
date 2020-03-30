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

export type IRoom = Room<IRoomStateSynced>;

interface IRoomLoadingState {
  isLoading: true;
  room: undefined;
  roomError: undefined;
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
}

type RoomState = IRoomLoadingState | IRoomSuccessState | IRoomFailureState;

const defaultRoomState: RoomState = {
  isLoading: false,
  room: undefined,
  roomError: '',
};

interface IRoomContext {
  createAndJoinRoom(): Promise<IRoom | null>;
  joinRoomByCode(roomId: string, options: IJoinOptions): Promise<IRoom | null>;
  leaveRoom(): void;
}

export const RoomContext = createContext<IRoomContext & RoomState>({
  isLoading: false,
  room: undefined,
  createAndJoinRoom: async () => {
    throw new Error('Unitialised room');
  },
  joinRoomByCode: async (_roomId: string) => {
    throw new Error('Unitiialised room');
  },
  leaveRoom: () => {
    return;
  },
  roomError: 'Unitialised Room',
});

export const useRoom = () => useContext(RoomContext);

export const RoomProvider: FunctionComponent = ({ children }) => {
  const colyseus = useColyseus();
  const [roomState, setRoomState] = useState<RoomState>(defaultRoomState);

  const createAndJoinRoom = useCallback(async (): Promise<IRoom | null> => {
    setRoomState({
      isLoading: true,
      room: undefined,
      roomError: undefined,
    });

    try {
      const room = await colyseus.create<IRoomStateSynced>(ROOM_NAME);
      const rooms = await colyseus.getAvailableRooms();
      const roomWithMetadata = rooms.find((r) => r.roomId === room.id);
      invariant(roomWithMetadata, 'Unable to find the room we just created');

      console.log(JSON.stringify(roomWithMetadata));

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
      });

      try {
        const rooms = await colyseus.getAvailableRooms<IRoomMetadata>(
          ROOM_NAME
        );
        const matchingRoom = rooms.find((room) => {
          if (!room.metadata) {
            return false;
          }
          return room.metadata.roomCode === roomCode;
        });

        if (!matchingRoom) {
          setRoomState({
            isLoading: false,
            room: undefined,
            roomError: 'Failed to find a room with a matching code',
          });
          return null;
        }

        const { roomId } = matchingRoom;

        const room = await colyseus.joinById<IRoomStateSynced>(roomId, options);

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
    });
  }, []);

  useEffect(() => {
    return () => roomState.room?.leave();
  }, [roomState.room]);

  const context: IRoomContext & RoomState = {
    ...roomState,
    createAndJoinRoom,
    joinRoomByCode,
    leaveRoom,
  };

  return (
    <RoomContext.Provider value={context}>{children}</RoomContext.Provider>
  );
};
