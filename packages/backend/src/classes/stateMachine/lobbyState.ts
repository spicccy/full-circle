import { ClientAction } from '@full-circle/shared/lib/actions';
import { notifyPlayerReady } from '@full-circle/shared/lib/actions/client';
import { IJoinOptions } from '@full-circle/shared/lib/join/interfaces';
import { PhaseType } from '@full-circle/shared/lib/roomState/constants';
import { Warning } from '@full-circle/shared/lib/roomState/interfaces';
import { getType } from 'typesafe-actions';

import { IClient } from '../../interfaces';
import { IRoomStateBackend, IState } from '../roomState';
import Phase from '../subSchema/phase';
import Player from './../subSchema/player';

class LobbyState implements IState {
  constructor(private roomState: IRoomStateBackend) {}

  onJoin = (client: IClient, options: IJoinOptions) => {
    const username = options.username;
    const clientId = client.id;

    if (!this.roomState.getCurator()) {
      this.roomState.setCurator(clientId);
      return;
    }

    const player = new Player(clientId, username);
    const error = this.roomState.addPlayer(player);
    if (error) {
      throw new Error(error);
    }

    this.roomState.addSubmittedPlayer(player.id);
  };

  onLeave = (client: IClient, _consented: boolean) => {
    this.roomState.removePlayer(client.id);
  };

  onReceive = (client: IClient, message: ClientAction) => {
    switch (message.type) {
      case getType(notifyPlayerReady): {
        this.onClientReady(client.id);
        return;
      }
    }
  };

  onClientReady = (clientId: string) => {
    if (clientId === this.roomState.getCurator() && this.validateLobby()) {
      this.advanceState();
    }
  };

  onStateStart = () => {
    this.roomState.setPhase(new Phase(PhaseType.LOBBY));
    this.roomState.clearSubmittedPlayers();
  };

  onStateEnd = () => {
    this.roomState.clearSubmittedPlayers();
  };

  validateLobby = (): boolean => {
    if (this.roomState.numPlayers < 3) {
      this.roomState.sendWarning(
        this.roomState.getCurator(),
        Warning.NOT_ENOUGH_PLAYERS
      );
      return false;
    }

    return true;
  };

  advanceState = () => {
    this.roomState.allocate();
    this.roomState.incrementRound();
    //this.roomState.setCurrPrompts();
    this.roomState.setDrawState();
  };
}

export default LobbyState;
