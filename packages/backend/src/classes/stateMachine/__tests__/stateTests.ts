import { IJoinOptions } from '@full-circle/shared/lib/join/interfaces';
import { PhaseType } from '@full-circle/shared/lib/roomState/constants';

import { MAX_PLAYERS } from '../../../constants';
import { IClient } from '../../../interfaces';
import RoomState from '../../roomState';
import LobbyState from '../lobbyState';

const testCurator: IClient = {
  id: 'curator',
  sessionId: '',
  close: () => {
    return;
  },
};

const testPlayer: IClient = {
  id: 'player',
  sessionId: '',
  close: () => {
    return;
  },
};

describe('Lobby State', () => {
  const room = new RoomState();
  const spySetCurator = jest.spyOn(room, 'setCurator'); // spy on foo.addListener
  const spyAddPlayer = jest.spyOn(room, 'addPlayer');
  const lobbyState = room.currState;
  const spyAdvanceState = jest.spyOn(lobbyState, 'advanceState');

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
    const option: any = {};
    lobbyState.onJoin(testCurator, option);

    expect(spySetCurator).toBeCalledTimes(1);
    expect(spySetCurator).toBeCalledWith('curator');
  });

  it('will wait for a curator to advance to the next state', () => {
    room.setCurator('curator');
    room.onClientReady('curator');

    expect(spyAdvanceState).toBeCalledTimes(1);
  });

  it('can add a player', () => {
    room.setCurator('curator');

    const lobbyState = new LobbyState(room);
    const option: IJoinOptions = { username: 'username' };
    lobbyState.onJoin(testPlayer, option);

    expect(spyAddPlayer).toBeCalledTimes(1);
    expect(spyAddPlayer).toBeCalledWith({
      id: 'player',
      username: 'username',
    });
  });

  it('will not allow more than MAX players to join', () => {
    const room = new RoomState();
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

describe('Draw State', () => {
  const room = new RoomState();
  room.advanceState();

  it('has a matching phaseType', () => {
    expect(room.phase.phaseType).toBe(PhaseType.DRAW);
  });

  it('has a timer', () => {
    expect(room.phase.phaseEnd).toBeGreaterThan(0);
  });

  it('advances to guess phase', () => {
    room.advanceState();
    expect(room.phase.phaseType).toBe(PhaseType.GUESS);
    expect(room.round).toBe(1);
  });
});

describe('Guess State', () => {
  const room = new RoomState();
  room.advanceState();
  room.advanceState();

  it('has a matching phaseType', () => {
    expect(room.phase.phaseType).toBe(PhaseType.GUESS);
  });

  it('has a timer', () => {
    expect(room.phase.phaseEnd).toBeGreaterThan(0);
  });

  it('advances to draw phase', () => {
    room.advanceState();
    expect(room.phase.phaseType).toBe(PhaseType.DRAW);
    expect(room.round).toBe(2);
  });
});
