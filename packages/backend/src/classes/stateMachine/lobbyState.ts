import RoomState, { IState } from '../roomState';
import { Client } from 'colyseus';

class LobbyState implements IState {
  room: RoomState;

  constructor(room: RoomState) {
    this.room = room;
  }

  onJoin = (client: Client) => {
    console.log(client);
  };

  onReceive = (message: any) => {
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
