import { MapSchema, Schema, type } from '@colyseus/schema';
import { IVote, VoteType } from '@full-circle/shared/lib/roomState';

class Vote extends Schema implements IVote {
  @type({ map: 'number' })
  playerVotes = new MapSchema<VoteType>();
}

export default Vote;
