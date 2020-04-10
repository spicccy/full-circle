import { IJoinOptions } from '@full-circle/shared/lib/join/interfaces';
import { PhaseType } from '@full-circle/shared/lib/roomState/constants';
import { IPlayer, Warning } from '@full-circle/shared/lib/roomState/interfaces';
import { mocked } from 'ts-jest/utils';

import { MAX_PLAYERS } from '../../../constants';
import { IClient, IRoom } from '../../../interfaces';
import { MyRoom } from '../../../MyRoom';
import { partialMock } from '../../../util/test/helpers';
import { mockClient, mockClock, mockRoom } from '../../helpers/testHelper';
import RoomState, { IState } from '../../roomState';
import LobbyState from '../lobbyState';
import { getAllocation } from './../../../util/sortPlayers/sortPlayers';

jest.mock('./../../../util/sortPlayers/sortPlayers');

export const testCurator: IClient = partialMock<IClient>({
  ...mockClient,
  id: 'curator',
});

export const testClient: IClient = partialMock<IClient>({
  ...mockClient,
  id: 'player',
});

const createTestPlayer = (num: number): IPlayer => {
  return {
    id: `${num}_id`,
    username: `${num}_username`,
  };
};

describe('Lobby State', () => {
  let room: IRoom;
  let roomState: RoomState;
  let lobbyState: IState;

  beforeEach(() => {
    room = mockRoom;
    roomState = new RoomState(room);
    roomState.setCurator('curator');

    for (let i = 0; i < 3; i++) {
      roomState.addPlayer(createTestPlayer(i));
    }

    lobbyState = roomState.currState;
    const mockedVal = [
      ['a', 'b', 'c', 'd', 'e'],
      ['e', 'd', 'b', 'a', 'c'],
    ];

    mocked(getAllocation).mockReturnValue(() => {
      return mockedVal;
    });
  });

  it('has a matching phaseType', () => {
    expect(roomState.phase.phaseType).toBe(PhaseType.LOBBY);
  });

  it('has no timer', () => {
    expect(roomState.phase.phaseEnd).toBeFalsy();
  });

  it('transitions to draw state', () => {
    lobbyState.advanceState();
    expect(roomState.phase.phaseType).toBe(PhaseType.DRAW);
  });

  it('can add a curator', () => {
    const options: IJoinOptions = { username: 'curatorUsername' };
    lobbyState.onJoin(testCurator, options);
    expect(roomState.curator).toBe('curator');
  });

  it('will wait for a curator to advance to the next state', () => {
    roomState.setCurator('curator');
    roomState.onClientReady('curator');
    expect(roomState.phase.phaseType).toBe(PhaseType.DRAW);
  });

  it('can add a player', () => {
    roomState.setCurator('curator');

    const lobbyState = new LobbyState(roomState);
    const option: IJoinOptions = { username: 'username' };
    lobbyState.onJoin(testClient, option);
    expect(roomState.players[testClient.id].username).toBe('username');
  });

  it('will not allow more than MAX players to join', () => {
    const roomState = new RoomState(room);
    roomState.setCurator('curatorId');

    const mockCloseJoinedPlayers = jest.fn();

    const lobbyState = new LobbyState(roomState);

    for (let i = 0; i < MAX_PLAYERS; i++) {
      lobbyState.onJoin(
        partialMock<IClient>({
          id: `player${i}`,
          sessionId: 'abcd',
          close: mockCloseJoinedPlayers,
        }),
        { username: `${i}_username` }
      );
    }
    expect(mockCloseJoinedPlayers).toBeCalledTimes(0);

    const mockCloseFailPlayer = jest.fn();

    const failPlayer: IClient = partialMock<IClient>({
      id: '',
      sessionId: '',
      close: mockCloseFailPlayer,
    });

    expect(() => {
      lobbyState.onJoin(failPlayer, { username: 'new_username' });
    }).toThrow();
  });

  it('will not allow duplicate players to join', () => {
    const roomState = new RoomState(room);

    const lobbyState = new LobbyState(roomState);

    lobbyState.onJoin(
      partialMock<IClient>({
        id: `curator`,
        sessionId: 'abcd',
      }),
      { username: '' }
    );

    lobbyState.onJoin(
      partialMock<IClient>({
        id: `player_a`,
        sessionId: 'abcd',
      }),
      { username: 'username' }
    );

    expect(roomState.numPlayers).toBe(1);

    expect(() => {
      lobbyState.onJoin(
        partialMock<IClient>({
          id: `player_b`,
          sessionId: 'abcd',
        }),
        { username: 'username' }
      );
    }).toThrowError(Warning.CONFLICTING_USERNAMES);

    lobbyState.onJoin(
      partialMock<IClient>({
        id: `player_b`,
        sessionId: 'abcd',
      }),
      { username: 'username_different' }
    );

    expect(roomState.numPlayers).toBe(2);
  });
});
