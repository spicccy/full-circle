import { PhaseType } from '@full-circle/shared/lib/roomState/constants';

import RoomState from '../roomState';

describe('Room state', () => {
  it('starts with the lobby state', () => {
    const state = new RoomState();
    expect(state.phase.phaseType).toBe(PhaseType.LOBBY);
  });

  it('transitions from lobby state to draw state', () => {
    const state = new RoomState();
    state.advanceState();
    expect(state.phase.phaseType).toBe(PhaseType.DRAW);
  });

  it('transitions from draw state to guess state', () => {
    const state = new RoomState();
    state.advanceState();
    state.advanceState();
    expect(state.phase.phaseType).toBe(PhaseType.GUESS);
  });

  it('transitions from guess state to draw state', () => {
    const state = new RoomState();
    state.advanceState();
    state.advanceState();
    state.advanceState();
    expect(state.phase.phaseType).toBe(PhaseType.DRAW);
  });

  it('automatically transitions only when all players are ready', () => {
    const state = new RoomState();
    expect(state.phase.phaseType).toBe(PhaseType.LOBBY);
    state.addPlayer({ username: 'Player 1', id: 'player1' });
    state.addPlayer({ username: 'Player 2', id: 'player2' });

    state.onClientReady('player1');
    expect(state.phase.phaseType).toBe(PhaseType.LOBBY);
    expect(state.numReadyPlayers).toBe(1);

    state.onClientReady('player2');
    expect(state.phase.phaseType).toBe(PhaseType.DRAW);
    expect(state.numReadyPlayers).toBe(0);
  });

  it('should not double count ready players', () => {
    const state = new RoomState();
    expect(state.phase.phaseType).toBe(PhaseType.LOBBY);
    state.addPlayer({ username: 'Player 1', id: 'player1' });
    state.addPlayer({ username: 'Player 2', id: 'player2' });

    state.onClientReady('player1');
    expect(state.phase.phaseType).toBe(PhaseType.LOBBY);
    expect(state.numReadyPlayers).toBe(1);

    state.onClientReady('player1');
    expect(state.phase.phaseType).toBe(PhaseType.LOBBY);
    expect(state.numReadyPlayers).toBe(1);
  });

  it('should increment the round when a guess/draw cycle is over', () => {
    const state = new RoomState();
    expect(state.round).toBe(0);

    state.advanceState();
    expect(state.round).toBe(1);

    state.advanceState();
    expect(state.round).toBe(1);

    state.advanceState();
    expect(state.round).toBe(2);
  });

  test.todo('transitions from the final guess state to the reveal state');
});
