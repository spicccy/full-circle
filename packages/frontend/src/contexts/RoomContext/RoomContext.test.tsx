import { warn } from '@full-circle/shared/lib/actions/server';
import { RoomErrorType } from '@full-circle/shared/lib/roomState';
import { partialMock } from '@full-circle/shared/lib/testHelpers';
import { render, wait, waitForDomChange } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Client, Room } from 'colyseus.js';
import { RoomAvailable } from 'colyseus.js/lib/Room';
import React, { useState } from 'react';
import { mocked, mockRoom as baseMockRoom } from 'src/testHelpers';

import { useColyseus } from '../ColyseusContext';
import { RoomProvider, useRoom } from './RoomContext';

jest.mock('../ColyseusContext');

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
      <div data-testid="roomError">{JSON.stringify(roomError)}</div>
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
  let mockRoomWithMetadata: RoomAvailable<any>;
  let mockColyseus: Client;
  let mockRoom: Room;

  beforeEach(() => {
    mockRoom = baseMockRoom;

    mockRoomWithMetadata = partialMock<RoomAvailable<any>>({
      roomId: 'roomId',
      metadata: { roomCode: 'roomCode' },
    });

    mockColyseus = partialMock<Client>({
      create: jest.fn().mockResolvedValue(mockRoom),
      getAvailableRooms: jest.fn().mockResolvedValue([mockRoomWithMetadata]),
      joinById: jest.fn(),
    });

    mocked(useColyseus).mockReturnValue(mockColyseus);
  });

  it('can create and join a room', async () => {
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
    expect(getByTestId('roomId')).toHaveTextContent('roomId');
    expect(getByTestId('roomCode')).toHaveTextContent('roomCode');
    expect(getByTestId('roomError')).toBeEmpty();
  });

  it('can join a room by id', async () => {
    mocked(mockColyseus.joinById).mockImplementation((roomCode) =>
      Promise.resolve(
        partialMock({
          ...mockRoom,
          id: roomCode,
        })
      )
    );

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
    const mockRoom2 = partialMock<Room>({ ...mockRoom, id: 'roomId2' });
    const mockRoomWithMetadata2 = partialMock<RoomAvailable<any>>({
      roomId: 'roomId2',
      metadata: { roomCode: 'roomCode2' },
    });

    mocked(mockColyseus.create)
      .mockResolvedValueOnce(mockRoom)
      .mockResolvedValueOnce(mockRoom2);
    mocked(mockColyseus.getAvailableRooms).mockResolvedValue([
      mockRoomWithMetadata,
      mockRoomWithMetadata2,
    ]);

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
    mocked(mockColyseus.create).mockRejectedValue(
      JSON.stringify(warn(RoomErrorType.UNKNOWN_ERROR))
    );
    mocked(mockColyseus.getAvailableRooms).mockRejectedValue(
      JSON.stringify(warn(RoomErrorType.UNKNOWN_ERROR))
    );

    const { getByTestId } = render(
      <RoomProvider>
        <TestConsumer />
      </RoomProvider>
    );

    userEvent.click(getByTestId('createAndJoinRoom'));
    await waitForDomChange();

    expect(getByTestId('isLoading')).toHaveTextContent('false');
    expect(getByTestId('roomId')).toBeEmpty();
    expect(getByTestId('roomError')).toHaveTextContent(
      RoomErrorType.UNKNOWN_ERROR
    );
  });

  it('handles join room error', async () => {
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
      RoomErrorType.ROOM_NOT_FOUND
    );
  });
});
