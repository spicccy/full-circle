import { Schema } from '@colyseus/schema';
import { ILink } from '@full-circle/shared/lib/roomState/interfaces';

import Image from './image';
import Prompt from './prompt';

class Link extends Schema implements ILink {
  _prompt: Prompt;
  _image: Image;

  constructor(drawId: string, guessId: string) {
    super();
    this._prompt = new Prompt(guessId);
    this._image = new Image(drawId);
  }

  get prompt() {
    return this._prompt;
  }

  get image() {
    return this._image;
  }

  get link() {
    return {
      prompt: this._prompt.prompt,
      image: this._image.image,
    };
  }
}

export default Link;
