import { Schema, type } from '@colyseus/schema';
import {
  IImage,
  IImageSynced,
} from '@full-circle/shared/lib/roomState/interfaces';

class Image extends Schema implements IImage, IImageSynced {
  @type('string')
  _imageData = '';

  @type('string')
  _playerId = '';

  constructor(id: string) {
    super();
    this._playerId = id;
  }

  setImage = (data: string) => {
    this._imageData = data;
  };

  get playerId() {
    return this._playerId;
  }

  get imageData() {
    return this._imageData;
  }
}

export default Image;
