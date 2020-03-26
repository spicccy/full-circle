import { Schema, type } from '@colyseus/schema';
import { ILink } from '@full-circle/shared/lib/roomState/interfaces';

import Image from './image';
import Prompt from './prompt';

class Link extends Schema implements ILink {
  @type('string')
  id = '';

  @type(Prompt)
  prompt = new Prompt();

  @type(Image)
  image = new Image();
}

export default Link;
