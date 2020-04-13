import { Schema } from '@colyseus/schema';
import { IImage } from '@full-circle/shared/lib/roomState/interfaces';

class Image extends Schema implements IImage {
  _imageData = '';

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

  get image() {
    return {
      playerId: this._playerId,
      imageData: this._imageData,
    };
  }
}

export default Image;
