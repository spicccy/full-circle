import { ClientAction } from '@full-circle/shared/lib/actions';
import { IJoinOptions } from '@full-circle/shared/lib/join/interfaces';
import { IRoomMetadata } from '@full-circle/shared/lib/roomState/interfaces';
import { Client, Room } from 'colyseus';

import RoomCodeGenerator from './classes/helpers/roomCodeGenerator';
import RoomState from './classes/roomState';
import { IClient } from './interfaces';

export class MyRoom extends Room<RoomState, IRoomMetadata> {
  onCreate(_options: any) {
    // Create an easy 4-letter code for joining rooms
    const roomCode = RoomCodeGenerator.getNewCode();
    this.setMetadata({ roomCode });
    console.log(`MyRoom ${this.roomId} created with code ${roomCode}.`);

    // Create a new state instance
    this.setState(new RoomState(this));
  }

  onJoin(client: IClient, options: IJoinOptions) {
    console.log(`${client.id} joined ${this.roomId}.`);
    this.state.onJoin(client, options);
  }

  onMessage(client: IClient, message: ClientAction) {
    this.state.onReceive(client, message);
  }

  async onLeave(client: Client, consented: boolean) {
    console.log(`${client.id} left ${this.roomId}.`);
    if (client.id === this.state.curator) {
      this.disconnect();
    } else {
      const canReconnect = this.state.onLeave(client, consented);
      if (canReconnect) {
        try {
          await this.allowReconnection(client);
          this.state.setPlayerReconnected(client.id);
        } catch (e) {
          this.state.removePlayer(client.id);
        }
      }
    }
  }

  onDispose() {
    console.log(`MyRoom ${this.roomId} was disposed.`);

    // Release the room code
    const { roomCode } = this.metadata;
    RoomCodeGenerator.releaseCode(roomCode);
  }
}
