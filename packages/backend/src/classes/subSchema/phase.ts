import { Schema, type } from '@colyseus/schema';
import { IPhase, PhaseType } from '@full-circle/shared/lib/roomState';

export const DEFAULT_DRAW_PHASE_LENGTH = 60000;
export const DEFAULT_GUESS_PHASE_LENGTH = 30000;

class Phase extends Schema implements IPhase {
  @type('number')
  phaseStart: number;

  @type('number')
  phaseEnd: number;

  @type('string')
  phaseType: PhaseType;

  /**
   *
   * @param duration in milliseconds
   */
  constructor(phaseType: PhaseType, durationMs?: number) {
    super();
    this.phaseStart = Date.now();
    this.phaseEnd = durationMs ? this.phaseStart + durationMs : 0;
    this.phaseType = phaseType;
  }
}

export default Phase;
