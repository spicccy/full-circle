import { Schema, type } from '@colyseus/schema';
import { IRoundData } from '@full-circle/shared/lib/roomState/interfaces';

class RoundData extends Schema implements IRoundData {
  // @filter(function(
  //   this: roundData,
  //   client: Client,
  // ):boolean {
  //   return this.id === client.sessionId;
  // });

  @type('string')
  id = '';

  @type('string')
  data = '';

  constructor(id: string, data: string) {
    super();
    this.id = id;
    this.data = data;
  }
}

export default RoundData;
