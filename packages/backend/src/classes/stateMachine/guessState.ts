import { ClientAction } from '@full-circle/shared/lib/actions';
import { PhaseType } from '@full-circle/shared/lib/roomState/constants';
import { Delayed } from 'colyseus';

import { IClient } from '../../interfaces';
import { IRoomStateBackend, IState } from '../roomState';
import Phase, { DEFAULT_GUESS_PHASE_LENGTH } from '../subSchema/phase';

class GuessState implements IState {
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
    this.room.setPhase(new Phase(PhaseType.GUESS, DEFAULT_GUESS_PHASE_LENGTH));
    this.readyPlayers.clear();
    this.timerHandle = this.room.clock.setTimeout(
      this.advanceState,
      DEFAULT_GUESS_PHASE_LENGTH
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
    this.room.incrementRound();
    this.room.setDrawState();
  };
}

export default GuessState;
