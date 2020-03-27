import { ArraySchema, Schema, type } from '@colyseus/schema';
import { IChain } from '@full-circle/shared/lib/roomState/interfaces';

import Link from './link';

class Chain extends Schema implements IChain {
  @type('string')
  id = '';

  @type([Link])
  links = new ArraySchema<Link>();
}

export default Chain;
