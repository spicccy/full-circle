import { ArraySchema, Schema, type } from '@colyseus/schema';
import { IChain } from '@full-circle/shared/lib/roomState';

import Link from './link';

export class Chain extends Schema implements IChain {
  @type('string')
  owner: string;

  @type([Link])
  links: ArraySchema<Link>;

  constructor(owner: string, links: Link[]) {
    super();
    this.owner = owner;
    this.links = new ArraySchema<Link>();
    links.forEach((link) => this.links.push(link));
  }
}
