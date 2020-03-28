import { Schema, type } from '@colyseus/schema';
import { PhaseType } from '@full-circle/shared/lib/roomState/constants';
import { IPhase } from '@full-circle/shared/lib/roomState/interfaces';

class Phase extends Schema implements IPhase {
  @type('number')
  phaseStart = 0;

  @type('number')
  phaseEnd = 0;

  @type('string')
  phaseType: PhaseType;

  /**
   *
   * @param duration in seconds
   */
  constructor(duration: number, phaseType: PhaseType) {
    super();
    this.phaseStart = Date.now();
    this.phaseEnd = this.phaseStart + duration * 1000;
    this.phaseType = phaseType;
  }
}

export default Phase;
