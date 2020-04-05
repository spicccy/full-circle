import { ClientAction } from '@full-circle/shared/lib/actions';

import { IClient } from '../../interfaces';
import RoomState, { IRoomStateBackend, IState } from '../roomState';

class GuessState implements IState {
  private room: IRoomStateBackend;
  private readyPlayers = new Set<string>();

  constructor(room: RoomState) {
    this.room = room;
  }

  onJoin = () => {
    throw new Error('Game has already started');
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
    if (this.room.gameIsOver) {
      this.room.setRevealState();
      return;
    }
    this.room.incrementRound();
    this.room.setDrawState();
  };
}

export default GuessState;
