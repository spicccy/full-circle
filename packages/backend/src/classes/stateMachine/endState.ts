import { ClientAction } from '@full-circle/shared/lib/actions';
import { IJoinOptions } from '@full-circle/shared/lib/join/interfaces';

import { IClient } from '../../interfaces';
import RoomState, { IRoomStateBackend, IState } from '../roomState';

class EndState implements IState {
  private room: IRoomStateBackend;

  constructor(room: RoomState) {
    this.room = room;
  }

  onJoin = (client: IClient, options: IJoinOptions) => {
    console.log(client, options);
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
