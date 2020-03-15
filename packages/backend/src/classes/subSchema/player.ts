import { Schema, type } from '@colyseus/schema';

class Player extends Schema {
  @type('string')
  id = '';

  @type('string')
  username = '';
}

export default Player;
