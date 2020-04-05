import { Schema, type } from '@colyseus/schema';
import { ILink } from '@full-circle/shared/lib/roomState/interfaces';

import Image from './image';
import Prompt from './prompt';

class Link extends Schema implements ILink {
  @type(Prompt)
  prompt: Prompt;

  @type(Image)
  image: Image;

  constructor(drawId: string, guessId: string) {
    super();
    this.prompt = new Prompt(guessId);
    this.image = new Image(drawId);
  }

  get getPrompt() {
    return this.prompt;
  }

  get getImage() {
    return this.image;
  }
}

export default Link;
