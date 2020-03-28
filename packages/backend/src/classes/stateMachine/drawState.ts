import { ClientAction } from '@full-circle/shared/lib/actions';
import { IJoinOptions } from '@full-circle/shared/lib/join/interfaces';
import { PhaseType } from '@full-circle/shared/lib/roomState/constants';

import { IClient } from '../../interfaces';
import RoomState, { IState } from '../roomState';
import Phase from '../subSchema/phase';
import GuessState from './guessState';

class DrawState implements IState {
  room: RoomState;

  constructor(room: RoomState) {
    this.room = room;
  }

  onJoin = (client: IClient, options: IJoinOptions) => {
    console.log(client, options);
  };

  onReceive = (message: ClientAction) => {
    console.log(message);
  };

  advanceState = () => {
    this.room.phase = new Phase(30, PhaseType.GUESS);
    this.room.currState = new GuessState(this.room);
  };
}

export default DrawState;
