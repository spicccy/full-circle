import { Schema, type } from '@colyseus/schema';
import { IPrompt } from '@full-circle/shared/lib/roomState/interfaces';

class Prompt extends Schema implements IPrompt {
  @type('string')
  id = '';

  @type('string')
  text = '';

  @type('string')
  playerId = '';
}

export default Prompt;
