import { Schema, type } from '@colyseus/schema';

class Image extends Schema {
  @type('string')
  id = '';

  @type('string')
  imageData = '';

  @type('string')
  playerId = '';
}

export default Image;
