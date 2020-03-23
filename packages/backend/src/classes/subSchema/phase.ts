import { Schema, type } from '@colyseus/schema';
import { IPhase } from '@full-circle/shared/lib/roomState/interfaces';
import { PhaseType } from '@full-circle/shared/lib/roomState/constants';

class Phase extends Schema implements IPhase {
  @type('number')
  phaseStart = 0;

  @type('number')
  phaseEnd = 0;

  @type('string')
  phaseType = PhaseType.LOBBY;

  /**
   *
   * @param duration in seconds
   */
  constructor(duration: number) {
    super();
    this.phaseStart = Date.now();
    this.phaseEnd = this.phaseStart + duration * 1000;
  }
}

export default Phase;
