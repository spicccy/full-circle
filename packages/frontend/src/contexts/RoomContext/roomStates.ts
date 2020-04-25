import { IRoomStateSynced } from '@full-circle/shared/lib/roomState';
import { RoomError } from '@full-circle/shared/lib/roomState/constants';
import { Room } from 'colyseus.js';

export type RoomStateWithFn = IRoomStateSynced & {
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
  roomError: RoomError;
  roomCode: undefined;
}

export type RoomState =
  | IRoomLoadingState
  | IRoomEmptyState
  | IRoomSuccessState
  | IRoomFailureState;

export const empty = (): IRoomEmptyState => ({
  isLoading: false,
  room: undefined,
  roomCode: undefined,
  roomError: undefined,
});

export const loading = (): IRoomLoadingState => ({
  isLoading: true,
  room: undefined,
  roomCode: undefined,
  roomError: undefined,
});

export const success = (room: IRoom, roomCode: string): IRoomSuccessState => ({
  isLoading: false,
  room,
  roomCode,
  roomError: undefined,
});

export const fail = (roomError: RoomError): IRoomFailureState => ({
  isLoading: false,
  room: undefined,
  roomCode: undefined,
  roomError,
});
