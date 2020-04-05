import { IJoinOptions } from '@full-circle/shared/lib/join/interfaces';
import { PhaseType } from '@full-circle/shared/lib/roomState/constants';

import { MAX_PLAYERS } from '../../../constants';
import { IClient } from '../../../interfaces';
import { mockClient, mockClock } from '../../helpers/testHelper';
import RoomState, { IState } from '../../roomState';
import LobbyState from '../lobbyState';

export const testCurator: IClient = {
  ...mockClient,
  id: 'curator',
};

export const testPlayer: IClient = {
  ...mockClient,
  id: 'player',
};

describe('Lobby State', () => {
  let room: RoomState;
  let lobbyState: IState;

  beforeEach(() => {
    room = new RoomState(mockClock);
    lobbyState = room.currState;
  });

  it('has a matching phaseType', () => {
    expect(room.phase.phaseType).toBe(PhaseType.LOBBY);
  });

  it('has no timer', () => {
    expect(room.phase.phaseEnd).toBeFalsy();
  });

  it('transitions to draw state', () => {
    lobbyState.advanceState();
    expect(room.phase.phaseType).toBe(PhaseType.DRAW);
  });

  it('can add a curator', () => {
    const options: IJoinOptions = { username: 'curatorUsername' };
    lobbyState.onJoin(testCurator, options);
    expect(room.curator).toBe('curator');
  });

  it('will wait for a curator to advance to the next state', () => {
    room.setCurator('curator');
    room.onClientReady('curator');
    expect(room.phase.phaseType).toBe(PhaseType.DRAW);
  });

  it('can add a player', () => {
    room.setCurator('curator');

    const lobbyState = new LobbyState(room);
    const option: IJoinOptions = { username: 'username' };
    lobbyState.onJoin(testPlayer, option);
    expect(room.players[testPlayer.id].username).toBe('username');
  });

  it('will not allow more than MAX players to join', () => {
    const room = new RoomState(mockClock);
    room.setCurator('curatorId');

    const mockCloseJoinedPlayers = jest.fn();

    const lobbyState = new LobbyState(room);
    const options: IJoinOptions = { username: 'username' };

    for (let i = 0; i < MAX_PLAYERS; i++) {
      lobbyState.onJoin(
        {
          id: `player${i}`,
          sessionId: 'abcd',
          close: mockCloseJoinedPlayers,
        },
        options
      );
    }
    expect(mockCloseJoinedPlayers).toBeCalledTimes(0);

    const mockCloseFailPlayer = jest.fn();

    const failPlayer: IClient = {
      id: '',
      sessionId: '',
      close: mockCloseFailPlayer,
    };

    lobbyState.onJoin(failPlayer, options);
    expect(mockCloseFailPlayer).toBeCalledTimes(1);
  });
});
