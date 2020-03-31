import { Schema, type } from '@colyseus/schema';
import { IImage } from '@full-circle/shared/lib/roomState/interfaces';

class Image extends Schema implements IImage {
  @type('string')
  id = '';

  @type('string')
  imageData = '';

  @type('string')
  playerId = '';

  constructor(id: string) {
    super();
    this.id = id;
  }
}

export default Image;
