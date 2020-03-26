import React, { useState } from 'react';
import { useRoom, RoomProvider } from './RoomContext';
import { render, waitForDomChange, wait } from '@testing-library/react';
import { useColyseus } from './ColyseusContext';
import { mocked, partialMock } from 'src/testHelpers';
import { Room, Client } from 'colyseus.js';
import userEvent from '@testing-library/user-event';

jest.mock('./ColyseusContext');

const TestConsumer: React.FunctionComponent = () => {
  const {
    isLoading,
    room,
    roomError,
    createAndJoinRoom,
    joinRoomById,
    leaveRoom,
  } = useRoom();
  const [joinRoomId, setJoinRoomId] = useState('');

  return (
    <div>
      <div data-testid="isLoading">{String(isLoading)}</div>
      <div data-testid="roomId">{room?.id}</div>
      <div data-testid="roomError">{roomError}</div>
      <button data-testid="createAndJoinRoom" onClick={createAndJoinRoom} />
      <input
        data-testid="joinRoomId"
        value={joinRoomId}
        onChange={(e) => setJoinRoomId(e.target.value)}
      />
      <button
        data-testid="joinRoomById"
        onClick={() => joinRoomById(joinRoomId, { username: 'test' })}
      />
      <button data-testid="leaveRoom" onClick={leaveRoom} />
    </div>
  );
};

describe('RoomContext', () => {
  it('should fail', () => {
    expect(true).toBe(false);
  });

  it('can create and joins a room', async () => {
    const mockRoom = partialMock<Room>({ id: '123', leave: jest.fn() });
    const mockColyseus = partialMock<Client>({
      create: () => Promise.resolve(mockRoom),
    });

    mocked(useColyseus).mockReturnValue(mockColyseus);

    const { getByTestId } = render(
      <RoomProvider>
        <TestConsumer />
      </RoomProvider>
    );

    expect(getByTestId('isLoading')).toHaveTextContent('false');
    expect(getByTestId('roomId')).toBeEmpty();
    expect(getByTestId('roomError')).toBeEmpty();

    userEvent.click(getByTestId('createAndJoinRoom'));

    expect(getByTestId('isLoading')).toHaveTextContent('true');
    expect(getByTestId('roomId')).toBeEmpty();
    expect(getByTestId('roomError')).toBeEmpty();

    await waitForDomChange();

    expect(getByTestId('isLoading')).toHaveTextContent('false');
    expect(getByTestId('roomId')).toHaveTextContent('123');
    expect(getByTestId('roomError')).toBeEmpty();
  });

  it('can join a room by id', async () => {
    const mockColyseus = partialMock<Client>({
      joinById: (roomCode) =>
        Promise.resolve(partialMock({ id: roomCode, leave: jest.fn() })),
    });

    mocked(useColyseus).mockReturnValue(mockColyseus);

    const { getByTestId } = render(
      <RoomProvider>
        <TestConsumer />
      </RoomProvider>
    );

    userEvent.type(getByTestId('joinRoomId'), 'catcat');
    userEvent.click(getByTestId('joinRoomById'));

    expect(getByTestId('isLoading')).toHaveTextContent('true');
    expect(getByTestId('roomId')).toBeEmpty();
    expect(getByTestId('roomError')).toBeEmpty();

    await waitForDomChange();

    expect(getByTestId('isLoading')).toHaveTextContent('false');
    expect(getByTestId('roomId')).toHaveTextContent('catcat');
    expect(getByTestId('roomError')).toBeEmpty();
  });

  it('can leave a room', async () => {
    const mockRoom = partialMock<Room>({ id: '123', leave: jest.fn() });
    const mockColyseus = partialMock<Client>({
      create: () => Promise.resolve(mockRoom),
    });

    mocked(useColyseus).mockReturnValue(mockColyseus);

    const { getByTestId } = render(
      <RoomProvider>
        <TestConsumer />
      </RoomProvider>
    );

    userEvent.click(getByTestId('createAndJoinRoom'));
    await waitForDomChange();

    expect(getByTestId('roomId')).toHaveTextContent('123');

    userEvent.click(getByTestId('leaveRoom'));

    expect(getByTestId('roomId')).toBeEmpty();
    await wait(() => expect(mockRoom.leave).toBeCalled());
  });

  it('leaves a room when you join a new one', async () => {
    const mockRoom = partialMock<Room>({ id: 'room1', leave: jest.fn() });
    const mockRoom2 = partialMock<Room>({ id: 'room2', leave: jest.fn() });
    const mockColyseus = partialMock<Client>({
      create: jest
        .fn()
        .mockResolvedValueOnce(mockRoom)
        .mockResolvedValueOnce(mockRoom2),
    });

    mocked(useColyseus).mockReturnValue(mockColyseus);

    const { getByTestId } = render(
      <RoomProvider>
        <TestConsumer />
      </RoomProvider>
    );

    userEvent.click(getByTestId('createAndJoinRoom'));
    await waitForDomChange();

    expect(getByTestId('roomId')).toHaveTextContent('room1');

    userEvent.click(getByTestId('createAndJoinRoom'));
    await waitForDomChange();

    expect(getByTestId('roomId')).toHaveTextContent('room2');
    await wait(() => expect(mockRoom.leave).toBeCalled());
  });

  it('leaves a room when component unmounts', async () => {
    const mockRoom = partialMock<Room>({ id: 'room1', leave: jest.fn() });
    const mockColyseus = partialMock<Client>({
      create: () => Promise.resolve(mockRoom),
    });

    mocked(useColyseus).mockReturnValue(mockColyseus);

    const { getByTestId, unmount } = render(
      <RoomProvider>
        <TestConsumer />
      </RoomProvider>
    );

    userEvent.click(getByTestId('createAndJoinRoom'));
    await waitForDomChange();

    expect(getByTestId('roomId')).toHaveTextContent('room1');

    unmount();

    expect(mockRoom.leave).toBeCalled();
  });

  it('handles create room error', async () => {
    const mockColyseus = partialMock<Client>({
      create: () => Promise.reject(new Error('bleh')),
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
    expect(getByTestId('roomError')).toHaveTextContent('bleh');
  });

  it('handles join room error', async () => {
    const mockColyseus = partialMock<Client>({
      joinById: () => Promise.reject(new Error('bleh')),
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
    expect(getByTestId('roomError')).toHaveTextContent('bleh');
  });
});
