import { Schema, type } from '@colyseus/schema';
import { IPlayer } from '@full-circle/shared/lib/roomState/interfaces';

class Player extends Schema implements IPlayer {
  @type('string')
  id = '';

  @type('string')
  username = '';
}

export default Player;
