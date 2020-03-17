import { Schema, type } from '@colyseus/schema';
import Image from './image';
import Prompt from './prompt';
import { ILink } from '@full-circle/shared/lib/roomState/interfaces';

class Link extends Schema implements ILink {
  @type('string')
  id = '';

  @type(Prompt)
  prompt = new Prompt();

  @type(Image)
  image = new Image();
}

export default Link;
