import { ClientAction } from '@full-circle/shared/lib/actions';
import { submitGuess } from '@full-circle/shared/lib/actions/client';
import { forceSubmit } from '@full-circle/shared/lib/actions/server';
import { PhaseType } from '@full-circle/shared/lib/roomState';
import { Delayed } from 'colyseus';
import { getType } from 'typesafe-actions';

import { BUFFER_MS } from '../../constants';
import { IClient } from '../../interfaces';
import { IRoomStateBackend, IState } from '../roomState';
import Phase, { DEFAULT_GUESS_PHASE_LENGTH } from '../subSchema/phase';

class GuessState implements IState {
  private timerHandle: Delayed | undefined;
  private bufferHandle: Delayed | undefined;

  constructor(private roomState: IRoomStateBackend) {}

  onJoin = (_client: IClient) => {};

  onLeave = (client: IClient, _consented: boolean) => {
    if (client.id === this.roomState.getCurator()) {
      this.roomState.setCuratorDisconnected();
    } else {
      this.roomState.setPlayerDisconnected(client.id);
    }
  };

  onReconnect = (client: IClient) => {
    if (client.id === this.roomState.getCurator()) {
      this.roomState.setCuratorReconnected();
    } else {
      this.roomState.setPlayerReconnected(client.id);
    }
  };

  onReceive = (client: IClient, message: ClientAction) => {
    switch (message.type) {
      case getType(submitGuess): {
        return this.submitGuess(client.id, message.payload);
      }
    }
  };

  onStateStart = () => {
    this.roomState.setPhase(
      new Phase(PhaseType.GUESS, DEFAULT_GUESS_PHASE_LENGTH)
    );
    this.roomState.clearSubmittedPlayers();
    this.timerHandle = this.roomState.clock.setTimeout(
      this.startBuffer,
      DEFAULT_GUESS_PHASE_LENGTH
    );
    this.roomState.updateRoundData();
  };

  onStateEnd = () => {
    this.timerHandle?.clear();
    this.bufferHandle?.clear();
    this.roomState.clearSubmittedPlayers();
  };

  advanceState = () => {
    this.roomState.setShowBuffer(false);
    this.roomState.updatePlayerScores();

    if (this.roomState.gameIsOver) {
      this.roomState.setRevealState();
    } else {
      this.roomState.incrementRound();
      this.roomState.setDrawState();
    }
  };

  private submitGuess = (clientId: string, guess: string) => {
    this.roomState.storeGuess(clientId, guess);
    this.roomState.addSubmittedPlayer(clientId);
    if (this.roomState.allPlayersSubmitted && !this.roomState.showBuffer) {
      this.startBuffer();
    }
  };

  private startBuffer = () => {
    this.roomState.setShowBuffer(true);
    this.roomState.sendAllAction(forceSubmit());
    this.bufferHandle = this.roomState.clock.setTimeout(
      this.advanceState,
      BUFFER_MS
    );
  };
}

export default GuessState;
