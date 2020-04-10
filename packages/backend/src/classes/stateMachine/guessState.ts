import { ClientAction } from '@full-circle/shared/lib/actions';
import { submitGuess } from '@full-circle/shared/lib/actions/client';
import { PhaseType } from '@full-circle/shared/lib/roomState/constants';
import { Warning } from '@full-circle/shared/lib/roomState/interfaces';
import { Delayed } from 'colyseus';
import { getType } from 'typesafe-actions';

import { IClient } from '../../interfaces';
import { IRoomStateBackend, IState } from '../roomState';
import Phase, { DEFAULT_GUESS_PHASE_LENGTH } from '../subSchema/phase';

class GuessState implements IState {
  private readyPlayers = new Set<string>();
  private timerHandle: Delayed | undefined;

  constructor(private roomState: IRoomStateBackend) {}

  onJoin = () => {
    throw new Error(Warning.GAME_ALREADY_STARTED);
  };

  onLeave = (client: IClient, _consented: boolean) => {
    this.readyPlayers.delete(client.id);
    this.roomState.removePlayer(client.id);
  };

  onReceive = (client: IClient, message: ClientAction) => {
    switch (message.type) {
      case getType(submitGuess): {
        const guess = message.payload;
        const id = client.id;
        this.roomState.storeGuess(id, guess);
        this.onClientReady(id);
        return;
      }
    }
  };

  onClientReady = (clientId: string) => {
    this.readyPlayers.add(clientId);
    if (this.readyPlayers.size >= this.roomState.numPlayers) {
      this.advanceState();
    }
  };

  onStateStart = () => {
    this.roomState.setPhase(
      new Phase(PhaseType.GUESS, DEFAULT_GUESS_PHASE_LENGTH)
    );
    this.readyPlayers.clear();
    this.timerHandle = this.roomState.clock.setTimeout(
      this.advanceState,
      DEFAULT_GUESS_PHASE_LENGTH
    );
    this.roomState.clearSubmittedPlayers();
  };

  onStateEnd = () => {
    this.timerHandle?.clear();
  };

  advanceState = () => {
    if (this.roomState.gameIsOver) {
      this.roomState.setRevealState();
      return;
    }
    this.roomState.incrementRound();
    this.roomState.setCurrPrompts();
    this.roomState.setDrawState();
  };
}

export default GuessState;
