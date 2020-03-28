import { ClientAction } from '@full-circle/shared/lib/actions';
import {
  notifyPlayerReady,
  submitDrawing,
  submitGuess,
} from '@full-circle/shared/lib/actions/client';
import {
  displayDrawing,
  displayPrompt,
} from '@full-circle/shared/lib/actions/server';
import { IJoinOptions } from '@full-circle/shared/lib/join/interfaces';
import { Room } from 'colyseus';
import { getType } from 'typesafe-actions';

import RoomState from './classes/roomState';
import { IClient } from './interfaces';

export class MyRoom extends Room<RoomState, any> {
  onCreate(_options: any) {
    this.setState(new RoomState());
    console.log(`MyRoom ${this.roomId} created.`);
    return;
  }

  onJoin(client: IClient, options: IJoinOptions) {
    console.log(`${client.sessionId} joined ${this.roomId}.`);
    this.state.onJoin(client, options);
    return;
  }

  onMessage(client: IClient, message: ClientAction) {
    switch (message.type) {
      case getType(submitDrawing): {
        console.log(`[${client.sessionId}] submitted a drawing.`);
        const canvasAction = message.payload;
        this.broadcast(displayDrawing(canvasAction));
        return;
      }
      case getType(submitGuess): {
        console.log(`[${client.sessionId}] submitted a guess.`);
        const guess = message.payload;
        this.broadcast(displayPrompt(guess));
        return;
      }
      case getType(notifyPlayerReady): {
        this.state.onClientReady(client.sessionId);
        return;
      }

      default: {
        console.log(`[${client.sessionId}] ${JSON.stringify(message)}.`);
      }
    }
  }

  onLeave(client: IClient, _consented: boolean) {
    console.log(`${client.sessionId} left ${this.roomId}.`);
    this.state.removePlayer(client.sessionId);
    return;
  }

  onDispose() {
    console.log(`MyRoom ${this.roomId} disposed.`);
    return;
  }
}
