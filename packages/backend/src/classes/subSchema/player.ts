import { Schema, type } from '@colyseus/schema';
import { IPlayer } from '@full-circle/shared/lib/roomState';

import Link from './link';

class Player extends Schema implements IPlayer {
  @type('string')
  id: string;

  @type('string')
  username: string;

  @type('boolean')
  disconnected = false;

  @type('number')
  score = 0;

  @type(Link)
  roundData?: Link;

  constructor(id: string, username: string) {
    super();
    this.id = id;
    this.username = username;
  }
}

export default Player;
