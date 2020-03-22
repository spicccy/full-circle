import RoomState, { IState } from '../roomState';
import { Client } from 'colyseus';
import { ClientAction } from '@full-circle/shared/lib/actions';
import Player from './../subSchema/player';
import { IJoinOptions } from '@full-circle/shared/lib/join/interfaces';

class LobbyState implements IState {
  room: RoomState;

  constructor(room: RoomState) {
    this.room = room;
  }

  onJoin = (client: Client, options: IJoinOptions) => {
    const username = options.username;
    const clientId = client.id;

    if (!this.room.getNumPlayers()) {
      this.room.setCurator(clientId);
      return;
    }

    const player = new Player(clientId, username);
    this.room.addPlayer(player);
  };

  onReceive = (message: ClientAction) => {
    console.log(message);
  };

  debugTransition = () => {
    this.room.setRevealState();
    const result = 'Lobby State';
    console.log(result);
    return result;
  };
}

export default LobbyState;
