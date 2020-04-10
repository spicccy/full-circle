import { ClientAction } from '@full-circle/shared/lib/actions';
import { submitDrawing } from '@full-circle/shared/lib/actions/client';
import { PhaseType } from '@full-circle/shared/lib/roomState/constants';
import { Delayed } from 'colyseus';
import { getType } from 'typesafe-actions';

import { IClient } from '../../interfaces';
import { IRoomStateBackend, IState } from '../roomState';
import Phase, { DEFAULT_DRAW_PHASE_LENGTH } from '../subSchema/phase';

class DrawState implements IState {
  private readyPlayers = new Set<string>();
  private timerHandle: Delayed | undefined;

  constructor(private room: IRoomStateBackend) {}

  onJoin = () => {
    throw new Error('Game has already started');
  };

  onLeave = (client: IClient, _consented: boolean) => {
    this.readyPlayers.delete(client.id);
    this.room.removePlayer(client.id);
  };

  onReceive = (client: IClient, message: ClientAction) => {
    switch (message.type) {
      case getType(submitDrawing): {
        const drawing = message.payload;
        const id = client.id;
        this.room.storeDrawing(id, drawing);
        this.onClientReady(id);
        return;
      }
    }
  };

  onClientReady = (clientId: string) => {
    this.readyPlayers.add(clientId);
    if (this.readyPlayers.size >= this.room.numPlayers) {
      this.advanceState();
    }
  };

  onStateStart = () => {
    this.room.setPhase(new Phase(PhaseType.DRAW, DEFAULT_DRAW_PHASE_LENGTH));
    this.readyPlayers.clear();
    this.timerHandle = this.room.clock.setTimeout(
      this.advanceState,
      DEFAULT_DRAW_PHASE_LENGTH
    );
    this.room.clearSubmittedPlayers();
  };

  onStateEnd = () => {
    this.timerHandle?.clear();
  };

  advanceState = () => {
    if (this.room.gameIsOver) {
      this.room.setRevealState();
      return;
    }
    this.room.setCurrDrawings();
    this.room.setGuessState();
  };
}

export default DrawState;
