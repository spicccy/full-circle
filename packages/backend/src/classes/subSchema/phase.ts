import { Schema, type } from '@colyseus/schema';
import { IPhase } from '@full-circle/shared/lib/roomState/interfaces';
import { PhaseType } from '@full-circle/shared/lib/roomState/constants';

class Phase extends Schema implements IPhase {
  @type('number')
  timestamp = 0;

  @type('number')
  phaseEnd = 0;

  @type('string')
  phaseType = PhaseType.LOBBY;

  constructor(duration: number) {
    super();
    this.timestamp = Date.now();
    this.phaseEnd = this.timestamp + duration * 1000;
  }
}

export default Phase;
