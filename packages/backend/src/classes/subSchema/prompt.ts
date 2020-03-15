import { Schema, type } from '@colyseus/schema';

class Prompt extends Schema {
  @type('string')
  id = '';

  @type('string')
  text = '';

  @type('string')
  playerId = '';
}

export default Prompt;
