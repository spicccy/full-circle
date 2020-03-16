import { Schema, ArraySchema, type } from '@colyseus/schema';
import Link from './link';

class Chain extends Schema {
  @type('string')
  id = '';

  @type([Link])
  links = new ArraySchema<Link>();
}

export default Chain;
