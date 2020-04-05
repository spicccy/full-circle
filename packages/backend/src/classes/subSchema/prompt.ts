import { Schema, type } from '@colyseus/schema';
import { IPrompt } from '@full-circle/shared/lib/roomState/interfaces';

class Prompt extends Schema implements IPrompt {
  @type('string')
  text = '';

  @type('string')
  playerId = '';

  constructor(id: string) {
    super();
    this.playerId = id;
  }

  setText = (text: string) => {
    this.text = text;
  };

  get getPlayerId() {
    return this.playerId;
  }
}

export default Prompt;
