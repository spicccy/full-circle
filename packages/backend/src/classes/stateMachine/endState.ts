import { ClientAction } from '@full-circle/shared/lib/actions';

import { IClient } from '../../interfaces';
import RoomState, { IRoomStateBackend, IState } from '../roomState';

class EndState implements IState {
  private room: IRoomStateBackend;

  constructor(room: RoomState) {
    this.room = room;
  }

  onJoin = () => {
    throw new Error('Game has already started');
  };

  onLeave = (client: IClient, _consented: boolean) => {
    this.room.removePlayer(client.id);
  };

  onReceive = (message: ClientAction) => {
    console.log(message);
  };

  onClientReady = (clientId: string) => {
    if (clientId === this.room.getCurator()) {
      this.advanceState();
    }
  };

  advanceState = () => {
    return;
  };
}

export default EndState;
