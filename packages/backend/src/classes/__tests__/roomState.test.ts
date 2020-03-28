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
