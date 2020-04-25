import { Schema, type } from '@colyseus/schema';
import { IPlayer, StickyNoteColour } from '@full-circle/shared/lib/roomState';

import Link from './link';

class Player extends Schema implements IPlayer {
  @type('string')
  id: string;

  @type('string')
  username: string;

  @type('boolean')
  disconnected = false;

  @type('boolean')
  submitted = false;

  @type('number')
  score = 0;

  @type('number')
  votes = 0;

  @type(Link)
  roundData?: Link;

  @type('string')
  stickyNoteColour = StickyNoteColour.GRAY;

  constructor(id: string, username: string) {
    super();
    this.id = id;
    this.username = username;
  }
}

export default Player;
