import { Schema, ArraySchema, type } from '@colyseus/schema';
import Link from './link';
import { IChain } from '@full-circle/shared/lib/roomState/interfaces';

class Chain extends Schema implements IChain {
  @type('string')
  id = '';

  @type([Link])
  links = new ArraySchema<Link>();
}

export default Chain;
