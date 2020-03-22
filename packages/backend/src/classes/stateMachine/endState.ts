import RoomState, { IState } from '../roomState';
import { Client } from 'colyseus';
import { ClientAction } from '@full-circle/shared/lib/actions';
import { IJoinOptions } from '@full-circle/shared/lib/join/interfaces';

class EndState implements IState {
  room: RoomState;

  constructor(room: RoomState) {
    this.room = room;
  }

  onJoin = (client: Client, options: IJoinOptions) => {
    console.log(client, options);
  };

  onReceive = (message: ClientAction) => {
    console.log(message);
  };

  debugTransition = () => {
    this.room.setGuessState();
    const result = 'End State';
    console.log(result);
    return result;
  };
}

export default EndState;
