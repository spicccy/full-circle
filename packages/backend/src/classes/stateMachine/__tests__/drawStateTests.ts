import { PhaseType } from '@full-circle/shared/lib/roomState/constants';

import { addPlayers } from '../../helpers/testHelper';
import RoomState from '../../roomState';

describe('Draw State', () => {
  let room: RoomState;

  beforeEach(() => {
    room = new RoomState();
    addPlayers(room, 8);
    room.advanceState();
  });

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
