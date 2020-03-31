import { render, wait, waitForDomChange } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Client, Room } from 'colyseus.js';
import { RoomAvailable } from 'colyseus.js/lib/Room';
import React, { useState } from 'react';
import { mocked, partialMock } from 'src/testHelpers';

import { useColyseus } from './ColyseusContext';
import { RoomProvider, useRoom } from './RoomContext';

jest.mock('./ColyseusContext');

const TestConsumer: React.FunctionComponent = () => {
  const {
    isLoading,
    room,
    roomError,
    createAndJoinRoom,
    joinRoomByCode,
    leaveRoom,
    roomCode,
  } = useRoom();

  const [joinRoomId, setJoinRoomId] = useState('');

  return (
    <div>
      <div data-testid="isLoading">{String(isLoading)}</div>
      <div data-testid="roomId">{room?.id}</div>
      <div data-testid="roomCode">{roomCode}</div>
      <div data-testid="roomError">{roomError}</div>
      <button data-testid="createAndJoinRoom" onClick={createAndJoinRoom} />
      <input
        data-testid="joinRoomId"
        value={joinRoomId}
        onChange={(e) => setJoinRoomId(e.target.value)}
      />
      <button
        data-testid="joinRoomById"
        onClick={() => joinRoomByCode(joinRoomId, { username: 'test' })}
      />
      <button data-testid="leaveRoom" onClick={leaveRoom} />
    </div>
  );
};

describe('RoomContext', () => {
  const mockRoom = partialMock<Room>({ id: 'roomId', leave: jest.fn() });
  const mockRoomWithMetada = partialMock<RoomAvailable<any>>({
    roomId: 'roomId',
    metadata: { roomCode: 'roomCode' },
  });
  const mockColyseus = partialMock<Client>({
    create: () => Promise.resolve(mockRoom),
    getAvailableRooms: () => Promise.resolve([mockRoomWithMetada]),
  });

  it('can create and joins a room', async () => {
    mocked(useColyseus).mockReturnValue(mockColyseus);

    const { getByTestId } = render(
      <RoomProvider>
        <TestConsumer />
      </RoomProvider>
    );

    expect(getByTestId('isLoading')).toHaveTextContent('false');
    expect(getByTestId('roomId')).toBeEmpty();
    expect(getByTestId('roomError')).toHaveTextContent('Uninitialised room');

    userEvent.click(getByTestId('createAndJoinRoom'));

    expect(getByTestId('isLoading')).toHaveTextContent('true');
    expect(getByTestId('roomId')).toBeEmpty();
    expect(getByTestId('roomError')).toBeEmpty();

    await waitForDomChange();

    expect(getByTestId('isLoading')).toHaveTextContent('false');
    expect(getByTestId('roomId')).toHaveTextContent('roomId');
    expect(getByTestId('roomCode')).toHaveTextContent('roomCode');
    expect(getByTestId('roomError')).toBeEmpty();
  });

  it('can join a room by id', async () => {
    const mockColyseus = partialMock<Client>({
      joinById: (roomCode): Promise<Room<any>> =>
        Promise.resolve(partialMock({ id: roomCode, leave: jest.fn() })),
      getAvailableRooms: () => Promise.resolve([mockRoomWithMetada]),
    });

    mocked(useColyseus).mockReturnValue(mockColyseus);

    const { getByTestId } = render(
      <RoomProvider>
        <TestConsumer />
      </RoomProvider>
    );

    userEvent.type(getByTestId('joinRoomId'), 'roomCode');
    userEvent.click(getByTestId('joinRoomById'));

    expect(getByTestId('isLoading')).toHaveTextContent('true');
    expect(getByTestId('roomId')).toBeEmpty();
    expect(getByTestId('roomError')).toBeEmpty();

    await waitForDomChange();

    expect(getByTestId('isLoading')).toHaveTextContent('false');
    expect(getByTestId('roomId')).toHaveTextContent('roomId');
    expect(getByTestId('roomCode')).toHaveTextContent('roomCode');
    expect(getByTestId('roomError')).toBeEmpty();
  });

  it('can leave a room', async () => {
    mocked(useColyseus).mockReturnValue(mockColyseus);

    const { getByTestId } = render(
      <RoomProvider>
        <TestConsumer />
      </RoomProvider>
    );

    userEvent.click(getByTestId('createAndJoinRoom'));
    await waitForDomChange();

    expect(getByTestId('roomId')).toHaveTextContent('roomId');

    userEvent.click(getByTestId('leaveRoom'));

    expect(getByTestId('roomId')).toBeEmpty();
    await wait(() => expect(mockRoom.leave).toBeCalled());
  });

  it('leaves a room when you join a new one', async () => {
    const mockRoom2 = partialMock<Room>({ id: 'roomId2', leave: jest.fn() });
    const mockRoomWithMetada2 = partialMock<RoomAvailable<any>>({
      roomId: 'roomId2',
      metadata: { roomCode: 'roomCode2' },
    });
    const mockColyseus = partialMock<Client>({
      create: jest
        .fn()
        .mockResolvedValueOnce(mockRoom)
        .mockResolvedValueOnce(mockRoom2),
      getAvailableRooms: () =>
        Promise.resolve([mockRoomWithMetada, mockRoomWithMetada2]),
    });

    mocked(useColyseus).mockReturnValue(mockColyseus);

    const { getByTestId } = render(
      <RoomProvider>
        <TestConsumer />
      </RoomProvider>
    );

    userEvent.click(getByTestId('createAndJoinRoom'));
    await waitForDomChange();

    expect(getByTestId('roomId')).toHaveTextContent('roomId');

    userEvent.click(getByTestId('createAndJoinRoom'));
    await waitForDomChange();

    expect(getByTestId('roomId')).toHaveTextContent('roomId2');
    await wait(() => expect(mockRoom.leave).toBeCalled());
  });

  it('leaves a room when component unmounts', async () => {
    mocked(useColyseus).mockReturnValue(mockColyseus);

    const { getByTestId, unmount } = render(
      <RoomProvider>
        <TestConsumer />
      </RoomProvider>
    );

    userEvent.click(getByTestId('createAndJoinRoom'));
    await waitForDomChange();

    expect(getByTestId('roomId')).toHaveTextContent('roomId');

    unmount();

    expect(mockRoom.leave).toBeCalled();
  });

  it('handles create room error', async () => {
    const mockColyseus = partialMock<Client>({
      create: () => Promise.reject(new Error('room create failed')),
      getAvailableRooms: () =>
        Promise.reject(new Error('get available rooms failed')),
    });

    mocked(useColyseus).mockReturnValue(mockColyseus);

    const { getByTestId } = render(
      <RoomProvider>
        <TestConsumer />
      </RoomProvider>
    );

    userEvent.click(getByTestId('createAndJoinRoom'));
    await waitForDomChange();

    expect(getByTestId('isLoading')).toHaveTextContent('false');
    expect(getByTestId('roomId')).toBeEmpty();
    expect(getByTestId('roomError')).toHaveTextContent('room create failed');
  });

  it('handles join room error', async () => {
    const mockColyseus = partialMock<Client>({
      joinById: () => Promise.reject(new Error('joinById failed')),
      getAvailableRooms: () =>
        Promise.reject(new Error('get available rooms failed')),
    });

    mocked(useColyseus).mockReturnValue(mockColyseus);

    const { getByTestId } = render(
      <RoomProvider>
        <TestConsumer />
      </RoomProvider>
    );

    userEvent.click(getByTestId('joinRoomById'));
    await waitForDomChange();

    expect(getByTestId('isLoading')).toHaveTextContent('false');
    expect(getByTestId('roomId')).toBeEmpty();
    expect(getByTestId('roomError')).toHaveTextContent(
      'get available rooms failed'
    );
  });
});
