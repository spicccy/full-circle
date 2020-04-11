import { ClientAction } from '@full-circle/shared/lib/actions';
import { submitDrawing } from '@full-circle/shared/lib/actions/client';
import { PhaseType } from '@full-circle/shared/lib/roomState/constants';
import { Warning } from '@full-circle/shared/lib/roomState/interfaces';
import { Delayed } from 'colyseus';
import { getType } from 'typesafe-actions';

import { IClient } from '../../interfaces';
import { IRoomStateBackend, IState } from '../roomState';
import Phase, { DEFAULT_DRAW_PHASE_LENGTH } from '../subSchema/phase';

class DrawState implements IState {
  private timerHandle: Delayed | undefined;

  constructor(private roomState: IRoomStateBackend) {}

  onJoin = () => {
    throw new Error(Warning.GAME_ALREADY_STARTED);
  };

  onLeave = (client: IClient, _consented: boolean) => {
    this.roomState.removePlayer(client.id);
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
      this.advanceState();
    }
  };

  onStateStart = () => {
    this.roomState.setPhase(
      new Phase(PhaseType.DRAW, DEFAULT_DRAW_PHASE_LENGTH)
    );
    this.timerHandle = this.roomState.clock.setTimeout(
      this.advanceState,
      DEFAULT_DRAW_PHASE_LENGTH
    );
    this.roomState.clearSubmittedPlayers();
  };

  onStateEnd = () => {
    this.timerHandle?.clear();
    this.roomState.clearSubmittedPlayers();
  };

  advanceState = () => {
    if (this.roomState.gameIsOver) {
      this.roomState.setRevealState();
      return;
    }
    this.roomState.setCurrDrawings();
    this.roomState.setGuessState();
  };
}

export default DrawState;
