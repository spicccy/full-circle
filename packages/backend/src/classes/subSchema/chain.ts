import { ArraySchema, Schema } from '@colyseus/schema';
import { IChain } from '@full-circle/shared/lib/roomState/interfaces';

import Link from './link';

class Chain extends Schema implements IChain {
  id = '';

  links = new ArraySchema<Link>();

  constructor(id: string) {
    super();
    this.id = id;
  }

  addLink = (newLink: Link) => {
    this.links.push(newLink);
  };

  get getLinks() {
    return this.links;
  }
}

export default Chain;
