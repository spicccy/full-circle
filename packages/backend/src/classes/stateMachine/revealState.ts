import RoomState, { IState } from '../roomState';
import { Client } from 'colyseus';
import { ClientAction } from '@full-circle/shared/lib/actions';

class RevealState implements IState {
  room: RoomState;

  constructor(room: RoomState) {
    this.room = room;
  }

  onJoin = (client: Client) => {
    console.log(client);
  };

  onReceive = (message: ClientAction) => {
    console.log(message);
  };

  debugTransition = () => {
    this.room.setDrawState();
    const result = 'Reveal State';
    console.log(result);
    return result;
  };
}

export default RevealState;
