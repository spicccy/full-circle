import { PhaseType } from '@full-circle/shared/lib/roomState/constants';

import { addPlayers } from '../../helpers/testHelper';
import RoomState from '../../roomState';

describe('Guess State', () => {
  let room: RoomState;

  beforeEach(() => {
    room = new RoomState();
    addPlayers(room, 10);
    room.advanceState();
    room.advanceState();
  });

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
