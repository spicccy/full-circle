import { PhaseType } from '@full-circle/shared/lib/roomState/constants';

import { IRoom } from '../../../interfaces';
import { addPlayers, mockRoom } from '../../helpers/testHelper';
import RoomState from '../../roomState';

describe('Guess State', () => {
  let roomState: RoomState;
  let room: IRoom;

  beforeEach(() => {
    room = mockRoom;
    roomState = new RoomState(room);
    addPlayers(roomState, 8);
    roomState.advanceState();
    roomState.advanceState();
  });

  it('has a matching phaseType', () => {
    expect(roomState.phase.phaseType).toBe(PhaseType.GUESS);
  });

  it('has a timer', () => {
    expect(roomState.phase.phaseEnd).toBeGreaterThan(0);
  });

  it('advances to draw phase', () => {
    roomState.advanceState();
    expect(roomState.phase.phaseType).toBe(PhaseType.DRAW);
    expect(roomState.round).toBe(3);
  });
});
