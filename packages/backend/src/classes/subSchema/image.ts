import { Schema, type } from '@colyseus/schema';
import { IImage } from '@full-circle/shared/lib/roomState/interfaces';

class Image extends Schema implements IImage {
  @type('string')
  imageData = '';

  @type('string')
  playerId = '';

  constructor(id: string) {
    super();
    this.playerId = id;
  }

  setImage = (data: string) => {
    this.imageData = data;
  };

  get getPlayerId() {
    return this.playerId;
  }
}

export default Image;
