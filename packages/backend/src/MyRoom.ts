import { Room, Client } from 'colyseus';
import RoomState from './classes/roomState';

export class MyRoom extends Room {
  onCreate(_options: any) {
    this.setState(new RoomState());
    return;
  }

  onJoin(_client: Client, _options: any) {
    return;
  }

  onMessage(_client: Client, _message: any) {
    return;
  }

  onLeave(_client: Client, _consented: boolean) {
    return;
  }

  onDispose() {
    return;
  }
}
