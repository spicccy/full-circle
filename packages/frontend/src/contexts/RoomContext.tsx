import { ROOM_NAME } from '@full-circle/shared/lib/constants';
import { IJoinOptions } from '@full-circle/shared/lib/join/interfaces';
import { Room } from 'colyseus.js';
import React, {
  createContext,
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { useColyseus } from './ColyseusContext';

interface IRoomLoadingState {
  isLoading: true;
  room: undefined;
  roomError: undefined;
}

interface IRoomSuccessState {
  isLoading: false;
  room?: Room;
  roomError: undefined;
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
  roomError: undefined,
};

interface IRoomContext {
  createAndJoinRoom(): Promise<Room | null>;
  joinRoomById(roomId: string, options: IJoinOptions): Promise<Room | null>;
  leaveRoom(): void;
}

export const RoomContext = createContext<IRoomContext & RoomState>({
  isLoading: false,
  room: undefined,
  createAndJoinRoom: async () => {
    throw new Error('Unitialised room');
  },
  joinRoomById: async (_roomId: string) => {
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

  const createAndJoinRoom = useCallback(async (): Promise<Room | null> => {
    setRoomState({
      isLoading: true,
      room: undefined,
      roomError: undefined,
    });

    try {
      const room = await colyseus.create(ROOM_NAME);
      setRoomState({
        isLoading: false,
        room,
        roomError: undefined,
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

  const joinRoomById = useCallback(
    async (roomId: string, options: IJoinOptions): Promise<Room | null> => {
      setRoomState({
        isLoading: true,
        room: undefined,
        roomError: undefined,
      });

      try {
        const room = await colyseus.joinById(roomId, options);
        setRoomState({
          isLoading: false,
          room,
          roomError: undefined,
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
      roomError: undefined,
    });
  }, []);

  useEffect(() => {
    return () => roomState.room?.leave();
  }, [roomState.room]);

  const context: IRoomContext & RoomState = {
    ...roomState,
    createAndJoinRoom,
    joinRoomById,
    leaveRoom,
  };

  return (
    <RoomContext.Provider value={context}>{children}</RoomContext.Provider>
  );
};
