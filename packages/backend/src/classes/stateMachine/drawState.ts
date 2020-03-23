import RoomState, { IState } from '../roomState';
import { ClientAction } from '@full-circle/shared/lib/actions';
import { IJoinOptions } from '@full-circle/shared/lib/join/interfaces';
import { IClient } from '../../interfaces';

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

  debugTransition = () => {
    this.room.setEndState();
    const result = 'Draw State';
    console.log(result);
    return result;
  };
}

export default DrawState;
