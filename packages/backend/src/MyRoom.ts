import { ClientAction } from '@full-circle/shared/lib/actions';
import { RoomSettings } from '@full-circle/shared/lib/roomSettings';
import { IRoomMetadata } from '@full-circle/shared/lib/roomState';
import { Client, Room } from 'colyseus';

import RoomCodeGenerator from './classes/helpers/roomCodeGenerator';
import RoomState from './classes/roomState';
import { IClient } from './interfaces';

export class MyRoom extends Room<RoomState, IRoomMetadata> {
  onCreate(options: RoomSettings) {
    // Create an easy 4-letter code for joining rooms
    const roomCode = RoomCodeGenerator.getNewCode();
    this.setMetadata({ roomCode });
    console.log(`MyRoom ${this.roomId} created with code ${roomCode}.`);

    // Create a new state instance
    this.setState(new RoomState(this, options));
  }

  onJoin(client: IClient) {
    console.log(`${client.id} joined ${this.roomId}.`);
    this.state.onJoin(client);
  }

  onMessage(client: IClient, message: ClientAction) {
    this.state.onReceive(client, message);
  }

  async onLeave(client: Client, consented: boolean) {
    this.state.onLeave(client, consented);
    await this.allowReconnection(client);
    this.state.onReconnect(client);
  }

  onDispose() {
    console.log(`MyRoom ${this.roomId} was disposed.`);

    // Release the room code
    const { roomCode } = this.metadata;
    RoomCodeGenerator.releaseCode(roomCode);
  }
}
