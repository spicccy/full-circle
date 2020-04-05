import { ClientAction } from '@full-circle/shared/lib/actions';
import { PhaseType } from '@full-circle/shared/lib/roomState/constants';
import { Delayed } from 'colyseus';

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

  onReceive = (message: ClientAction) => {
    console.log(message);
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
  };

  onStateEnd = () => {
    this.timerHandle?.clear();
  };

  private advanceState = () => {
    if (this.room.gameIsOver) {
      this.room.setRevealState();
      return;
    }
    this.room.setGuessState();
  };
}

export default DrawState;
