import { PhaseType } from '@full-circle/shared/lib/roomState/constants';

import { IRoom } from '../../../interfaces';
import { addPlayers, mockRoom } from '../../helpers/testHelper';
import RoomState from '../../roomState';

describe('Draw State', () => {
  let roomState: RoomState;
  let room: IRoom;

  beforeEach(() => {
    room = mockRoom;
    roomState = new RoomState(room);
    addPlayers(roomState, 8);
    roomState.advanceState();
  });

  it('has a matching phaseType', () => {
    expect(roomState.phase.phaseType).toBe(PhaseType.DRAW);
  });

  it('has a timer', () => {
    expect(roomState.phase.phaseEnd).toBeGreaterThan(0);
  });

  it('advances to guess phase', () => {
    roomState.advanceState();
    expect(roomState.phase.phaseType).toBe(PhaseType.GUESS);
    expect(roomState.round).toBe(1);
  });
});
