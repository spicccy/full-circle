import { ClientAction } from '@full-circle/shared/lib/actions';
import { submitDrawing } from '@full-circle/shared/lib/actions/client';
import { forceSubmit, warn } from '@full-circle/shared/lib/actions/server';
import { IJoinOptions } from '@full-circle/shared/lib/join/interfaces';
import { PhaseType, RoomErrorType } from '@full-circle/shared/lib/roomState';
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

  onJoin = (_client: IClient, options: IJoinOptions) => {
    this.roomState.attemptReconnection(options.username);
    this.roomState.throwJoinRoomError(warn(RoomErrorType.GAME_ALREADY_STARTED));
  };

  onLeave = (client: IClient, _consented: boolean) => {
    this.roomState.setPlayerDisconnected(client.id);
    return true;
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
    this.roomState.updateRoundData();
  };

  onStateEnd = () => {
    this.timerHandle?.clear();
    this.bufferHandle?.clear();
    this.roomState.clearSubmittedPlayers();
    this.roomState.updatePlayerScores();
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
      return;
    }
    this.roomState.incrementRound();
    this.roomState.setGuessState();
  };
}

export default DrawState;
