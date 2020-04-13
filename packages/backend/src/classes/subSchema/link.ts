import { Schema, type } from '@colyseus/schema';
import {
  ILink,
  ILinkSynced,
} from '@full-circle/shared/lib/roomState/interfaces';

import Image from './image';
import Prompt from './prompt';

class Link extends Schema implements ILink, ILinkSynced {
  @type(Prompt)
  _prompt: Prompt;

  @type(Image)
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
}

export default Link;
