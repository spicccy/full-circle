import { ClientAction } from '@full-circle/shared/lib/actions';
import { submitDrawing } from '@full-circle/shared/lib/actions/client';
import { forceSubmit } from '@full-circle/shared/lib/actions/server';
import {
  createPreRoomMessage,
  IJoinOptions,
  PRE_ROOM_MESSAGE,
} from '@full-circle/shared/lib/join/interfaces';
import { PhaseType } from '@full-circle/shared/lib/roomState/constants';
import { Warning } from '@full-circle/shared/lib/roomState/interfaces';
import { Delayed } from 'colyseus';
import { getType } from 'typesafe-actions';

import { BUFFER_MS } from '../../constants';
import { IClient } from '../../interfaces';
import { IRoomStateBackend, IState } from '../roomState';
import Phase, { DEFAULT_DRAW_PHASE_LENGTH } from '../subSchema/phase';

class DrawState implements IState {
  private timerHandle: Delayed | undefined;
  private bufferHandle: Delayed | undefined;

  constructor(private roomState: IRoomStateBackend) {}

  onJoin = (client: IClient, options: IJoinOptions) => {
    const username = options.username;
    // see if the player had previously been in the lobby
    const maybeExistingId = this.roomState.getReconnectableId(username);
    if (maybeExistingId) {
      // throw an error since we can't message them till they are in the room
      throw new Error(
        createPreRoomMessage(
          PRE_ROOM_MESSAGE.RECONNECT_COMMAND,
          maybeExistingId
        )
      );
    }
    throw new Error(Warning.GAME_ALREADY_STARTED);
  };

  onLeave = (client: IClient, _consented: boolean) => {
    this.roomState.playerDisconnected(client.id);
  };

  onReceive = (client: IClient, message: ClientAction) => {
    switch (message.type) {
      case getType(submitDrawing): {
        const drawing = message.payload;
        const id = client.id;
        this.roomState.storeDrawing(id, drawing);
        this.onClientReady(id);
        return;
      }
    }
  };

  onClientReady = (clientId: string) => {
    this.roomState.addSubmittedPlayer(clientId);
    if (this.roomState.allPlayersSubmitted) {
      this.startBuffer();
    }
  };

  onStateStart = () => {
    this.roomState.setPhase(
      new Phase(PhaseType.DRAW, DEFAULT_DRAW_PHASE_LENGTH)
    );
    this.timerHandle = this.roomState.clock.setTimeout(
      this.startBuffer,
      DEFAULT_DRAW_PHASE_LENGTH
    );
    this.roomState.clearSubmittedPlayers();
  };

  onStateEnd = () => {
    this.timerHandle?.clear();
    this.bufferHandle?.clear();
    this.roomState.clearSubmittedPlayers();
  };

  startBuffer = () => {
    this.roomState.unsubmittedPlayerIds.forEach((id) => {
      this.roomState.sendAction(id, forceSubmit());
    });

    this.bufferHandle = this.roomState.clock.setTimeout(
      this.advanceState,
      BUFFER_MS
    );
  };

  advanceState = () => {
    if (this.roomState.gameIsOver) {
      this.roomState.setRevealState();
      this.roomState.sendReveal();
      return;
    }
    this.roomState.setCurrDrawings();
    this.roomState.setGuessState();
  };
}

export default DrawState;
