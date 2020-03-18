import { Room, Client } from 'colyseus';
import RoomState from './classes/roomState';
import { ClientAction } from '@full-circle/shared/lib/actions';
import { displayDrawing } from '@full-circle/shared/lib/actions/server';
import { getType } from 'typesafe-actions';
import { submitDrawing } from '@full-circle/shared/lib/actions/client';

export class MyRoom extends Room {
  onCreate(_options: any) {
    this.setState(new RoomState());
    console.log(`MyRoom ${this.roomId} created.`);
    return;
  }

  onJoin(client: Client, _options: any) {
    console.log(`${client.sessionId} joined ${this.roomId}.`);
    this.state.onJoin(client, _options);
    return;
  }

  onMessage(client: Client, message: ClientAction) {
    switch (message.type) {
      case getType(submitDrawing): {
        console.log(`[${client.sessionId}] submitted a drawing.`);
        const canvasAction = message.payload;
        this.broadcast(displayDrawing(canvasAction));
        return;
      }

      default: {
        console.log(`[${client.sessionId}] ${JSON.stringify(message)}.`);
      }
    }
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
