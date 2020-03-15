import { Schema, type } from '@colyseus/schema';

class Phase extends Schema {
  @type('number')
  timestamp = 0;

  @type('number')
  phaseType = 0;
}

export default Phase;
