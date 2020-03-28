import { ClientAction } from '@full-circle/shared/lib/actions';
import { IJoinOptions } from '@full-circle/shared/lib/join/interfaces';
import { PhaseType } from '@full-circle/shared/lib/roomState/constants';

import { IClient } from '../../interfaces';
import RoomState, { IState } from '../roomState';
import Phase from '../subSchema/phase';
import DrawState from './drawState';

class GuessState implements IState {
  private room: RoomState;
  private readyPlayers = new Set<string>();

  constructor(room: RoomState) {
    this.room = room;
  }

  onJoin = (client: IClient, options: IJoinOptions) => {
    console.log(client, options);
  };

  onReceive = (message: ClientAction) => {
    console.log(message);
  };

  onClientReady = (clientId: string) => {
    this.readyPlayers.add(clientId);
    if (this.readyPlayers.size >= this.room.numPlayers) {
      this.advanceState();
    }
  };

  advanceState = () => {
    this.room.round = this.room.round + 1;
    this.room.phase = new Phase(PhaseType.DRAW, 60);
    this.room.currState = new DrawState(this.room);
  };
}

export default GuessState;
