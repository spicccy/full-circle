import { Room, Client } from 'colyseus';

export class MyRoom extends Room {
  onCreate(_options: any) {
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
