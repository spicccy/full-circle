import { Schema, type } from '@colyseus/schema';
import Image from './image';
import Prompt from './prompt';

class Link extends Schema {
  @type('string')
  id = '';

  @type(Prompt)
  prompt = new Prompt();

  @type(Image)
  image = new Image();

  getImage(){
    return this.image
  }
}

export default Link;
