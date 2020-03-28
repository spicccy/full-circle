import { ClientAction } from '@full-circle/shared/lib/actions';
import { IJoinOptions } from '@full-circle/shared/lib/join/interfaces';

import { IClient } from '../../interfaces';
import RoomState, { IRoomStateBackend, IState } from '../roomState';

class DrawState implements IState {
  private room: IRoomStateBackend;
  private readyPlayers = new Set<string>();

  constructor(room: RoomState) {
    this.room = room;
  }

  onJoin = (client: IClient, options: IJoinOptions) => {
    console.log(client, options);
  };

  onLeave = (client: IClient, _consented: boolean) => {
    this.readyPlayers.delete(client.id);
    this.room.removePlayer(client.id);
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
    this.room.setGuessState();
  };
}

export default DrawState;
