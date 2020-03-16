import { Schema, ArraySchema, MapSchema, type } from '@colyseus/schema';
import Chain from './chain';
import Player from './player';
import Phase from './phase';

class RoomState extends Schema {
  @type('string')
  curator = '';

  @type([Chain])
  chains = new ArraySchema<Chain>();

  @type({ map: Player })
  player = new MapSchema<Player>();

  @type('number')
  round = 0;

  @type(Phase)
  phase = new Phase();
}

export default RoomState;
