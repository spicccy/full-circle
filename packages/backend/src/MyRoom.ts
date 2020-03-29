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
import { IRoomMetadata } from '@full-circle/shared/lib/roomState/interfaces';
import { Room } from 'colyseus';
import { getType } from 'typesafe-actions';

import { getNewCode } from './classes/helpers/roomCode';
import RoomState from './classes/roomState';
import { IClient } from './interfaces';

export class MyRoom extends Room<RoomState, IRoomMetadata> {
  usedCodes: string[] = [];

  onCreate(_options: any) {
    // Create an easy 4-letter code for joining rooms
    const roomCode = getNewCode(this.usedCodes);
    this.usedCodes.push(roomCode);
    this.setMetadata({ roomCode });
    console.log(`MyRoom ${this.roomId} created with code ${roomCode}.`);

    // Create a new state instance
    this.setState(new RoomState());
  }

  onJoin(client: IClient, options: IJoinOptions) {
    console.log(`${client.sessionId} joined ${this.roomId}.`);

    this.state.onJoin(client, options);
  }

  onMessage(client: IClient, message: ClientAction) {
    switch (message.type) {
      case getType(submitDrawing): {
        // TODO: delegate the submission to the distribution algorithm implemented in the state
        console.log(`[${client.sessionId}] submitted a drawing.`);
        const canvasAction = message.payload;
        this.broadcast(displayDrawing(canvasAction));
        return;
      }
      case getType(submitGuess): {
        // TODO: delegate the submission to the distribution algorithm implemented in the state
        console.log(`[${client.sessionId}] submitted a guess.`);
        const guess = message.payload;
        this.broadcast(displayPrompt(guess));
        return;
      }
      // Handle a client being ready to progress to the next phase
      case getType(notifyPlayerReady): {
        this.state.onClientReady(client.sessionId);
        return;
      }

      default: {
        console.log(`[${client.sessionId}] ${JSON.stringify(message)}.`);
      }
    }
  }

  onLeave(client: IClient, consented: boolean) {
    console.log(`${client.sessionId} left ${this.roomId}.`);

    this.state.onLeave(client, consented);
  }

  onDispose() {
    console.log(`MyRoom ${this.roomId} was disposed.`);

    // Release the room code
    const { roomCode } = this.metadata;
    this.usedCodes = this.usedCodes.filter((code) => code !== roomCode);
  }
}
