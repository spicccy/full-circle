import { Room, Client } from 'colyseus';
import RoomState from './classes/roomState';

export class MyRoom extends Room {
  onCreate(_options: any) {
    this.setState(new RoomState());
    console.log(`MyRoom ${this.roomId} created.`);
    return;
  }

  onJoin(client: Client, _options: any) {
    console.log(`${client.sessionId} joined ${this.roomId}.`);
    return;
  }

  onMessage(client: Client, message: any) {
    console.log(`[${client.sessionId}] ${message}.`);
    return;
  }

  onLeave(client: Client, _consented: boolean) {
    console.log(`${client.sessionId} left ${this.roomId}.`);
    return;
  }

  onDispose() {
    console.log(`MyRoom ${this.roomId} disposed.`);
    return;
  }
}
