import { ClientAction } from '@full-circle/shared/lib/actions';
import {
  notifyPlayerReady,
  submitDrawing,
  submitGuess,
} from '@full-circle/shared/lib/actions/client';
import { IJoinOptions } from '@full-circle/shared/lib/join/interfaces';
import { IRoomMetadata } from '@full-circle/shared/lib/roomState/interfaces';
import { Room } from 'colyseus';
import { getType } from 'typesafe-actions';

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
    this.setState(new RoomState(this.clock));
  }

  onJoin(client: IClient, options: IJoinOptions) {
    console.log(`${client.id} joined ${this.roomId}.`);
    this.state.onJoin(client, options);
  }

  onMessage(client: IClient, message: ClientAction) {
    switch (message.type) {
      case getType(submitDrawing): {
        // TODO: delegate the submission to the distribution algorithm implemented in the state
        // store the canvas and get ready to send it to another player
        // const canvasAction = message.payload;
        console.log(`[${client.id}] submitted a drawing.`);
        //TODO: these two below functions should be squashed into one functionality
        // i.e. make the array that onClientReady be observable
        // right now there is a separation of concerns
        // addSubmittedPlayer adds to a map that is synced with the frontend (to show submitted status)
        // onClientReady adds to an array that checks if all players are read (to progress to next phase)
        this.state.addSubmittedPlayer(client.id);
        this.state.onClientReady(client.id);
        return;
      }
      case getType(submitGuess): {
        // TODO: delegate the submission to the distribution algorithm implemented in the state
        // store the guess and get ready to send it as a prompt
        // const guess = message.payload;
        console.log(`[${client.id}] submitted a guess.`);
        this.state.onClientReady(client.id);
        return;
      }
      // Handle a client being ready to progress to the next phase
      case getType(notifyPlayerReady): {
        this.state.onClientReady(client.id);
        return;
      }

      default: {
        console.log(`[${client.id}] ${JSON.stringify(message)}.`);
      }
    }
  }

  onLeave(client: IClient, consented: boolean) {
    console.log(`${client.id} left ${this.roomId}.`);
    if (client.id === this.state.curator) {
      this.disconnect();
    } else {
      this.state.onLeave(client, consented);
    }
  }

  onDispose() {
    console.log(`MyRoom ${this.roomId} was disposed.`);

    // Release the room code
    const { roomCode } = this.metadata;
    RoomCodeGenerator.releaseCode(roomCode);
  }
}
