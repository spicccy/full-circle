import { Schema, type } from '@colyseus/schema';
import { PhaseType } from '@full-circle/shared/lib/roomState/constants';
import { IPhase } from '@full-circle/shared/lib/roomState/interfaces';

export const DEFAULT_DRAW_PHASE_LENGTH = 60;
export const DEFAULT_GUESS_PHASE_LENGTH = 30;

class Phase extends Schema implements IPhase {
  @type('number')
  phaseStart = 0;

  @type('number')
  phaseEnd: number | undefined = undefined;

  @type('string')
  phaseType: PhaseType;

  /**
   *
   * @param duration in seconds
   */
  constructor(phaseType: PhaseType, duration?: number) {
    super();
    this.phaseStart = Date.now();
    this.phaseEnd = duration ? this.phaseStart + duration * 1000 : undefined;
    this.phaseType = phaseType;
  }
}

export default Phase;
