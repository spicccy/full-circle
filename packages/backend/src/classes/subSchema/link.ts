import { Schema, type } from '@colyseus/schema';
import { ILink, LinkType } from '@full-circle/shared/lib/roomState';

class Link extends Schema implements ILink {
  @type('string')
  type: LinkType;

  @type('string')
  id: string;

  @type('string')
  data?: string;

  @type('string')
  playerId: string;

  constructor(link: ILink) {
    super();
    this.type = link.type;
    this.id = link.id;
    this.data = link.data;
    this.playerId = link.playerId;
  }
}

export default Link;
