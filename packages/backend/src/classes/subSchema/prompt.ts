import { Schema, type } from '@colyseus/schema';
import {
  IPrompt,
  IPromptPrivate,
} from '@full-circle/shared/lib/roomState/interfaces';

class Prompt extends Schema implements IPrompt, IPromptPrivate {
  @type('string')
  _text = '';

  @type('string')
  _playerId = '';

  constructor(id: string) {
    super();
    this._playerId = id;
  }

  setText = (text: string) => {
    this._text = text;
  };

  get playerId() {
    return this._playerId;
  }

  get text() {
    return this._text;
  }
}

export default Prompt;
