import { ClientAction } from '@full-circle/shared/lib/actions';
import { joinGame, startGame } from '@full-circle/shared/lib/actions/client';
import { joinGameError } from '@full-circle/shared/lib/actions/server';
import {
  GameType,
  PhaseType,
  ServerError,
} from '@full-circle/shared/lib/roomState';
import { getType } from 'typesafe-actions';

import { IClient } from '../../interfaces';
import { IRoomStateBackend, IState } from '../roomState';
import Phase from '../subSchema/phase';

class LobbyState implements IState {
  constructor(private roomState: IRoomStateBackend) {}

  onJoin = (client: IClient) => {
    if (!this.roomState.getCurator()) {
      this.roomState.setCurator(client.id);
      return;
    }
  };

  onLeave = (client: IClient, _consented: boolean) => {
    if (client.id === this.roomState.getCurator()) {
      this.roomState.setCuratorDisconnected();
    } else {
      this.roomState.removePlayer(client.id);
    }
  };

  onReconnect = (client: IClient) => {
    if (client.id === this.roomState.getCurator()) {
      this.roomState.setCuratorReconnected();
    }
  };

  onReceive = (client: IClient, message: ClientAction) => {
    switch (message.type) {
      case getType(startGame): {
        return this.startGame();
      }
      case getType(joinGame): {
        return this.addPlayer(client.id, message.payload.username);
      }
    }
  };

  onStateStart = () => {
    this.roomState.setPhase(new Phase(PhaseType.LOBBY));
  };

  onStateEnd = () => {};

  advanceState = () => {
    this.roomState.generateChains();
    this.roomState.incrementRound();
    if (this.roomState.settings.gameType === GameType.PROMPT_PACK) {
      this.roomState.setDrawState();
    }

    if (this.roomState.settings.gameType === GameType.CUSTOM) {
      this.roomState.setGuessState();
    }
  };

  private addPlayer = (clientId: string, username: string) => {
    const error = this.roomState.addPlayer(clientId, username);
    if (error) {
      this.roomState.sendAction(clientId, joinGameError(error));
    }
  };

  private startGame = () => {
    if (this.validateLobby()) {
      this.advanceState();
    }
  };

  private validateLobby = (): boolean => {
    if (this.roomState.numPlayers < 3) {
      this.roomState.sendWarning(
        this.roomState.getCurator(),
        ServerError.NOT_ENOUGH_PLAYERS
      );
      return false;
    }

    return true;
  };
}

export default LobbyState;
