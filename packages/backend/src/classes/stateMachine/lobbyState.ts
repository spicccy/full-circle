import { ClientAction } from '@full-circle/shared/lib/actions';
import { IJoinOptions } from '@full-circle/shared/lib/join/interfaces';
import { PhaseType } from '@full-circle/shared/lib/roomState/constants';
import { notifyPlayerReady } from '@full-circle/shared/lib/actions/client';

import { MAX_PLAYERS } from '../../constants';
import { IClient } from '../../interfaces';
import { IRoomStateBackend, IState } from '../roomState';
import Phase from '../subSchema/phase';
import Player from './../subSchema/player';
import { getType } from 'typesafe-actions';

class LobbyState implements IState {
  constructor(private room: IRoomStateBackend) {}

  onJoin = (client: IClient, options: IJoinOptions) => {
    const username = options.username;
    const clientId = client.id;

    if (this.room.numPlayers >= MAX_PLAYERS) {
      client.close();
      return;
    }

    if (!this.room.getCurator()) {
      this.room.setCurator(clientId);
      return;
    }

    const player = new Player(clientId, username);
    this.room.addPlayer(player);
    this.room.addSubmittedPlayer(player.id);

    // TODO: TESTS CHAIN ALLOCATION DELETE THIS
    if (this.room.numPlayers == 5) {
      this.room.allocate();
    }
  };

  onLeave = (client: IClient, _consented: boolean) => {
    this.room.removePlayer(client.id);
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
    if (clientId === this.room.getCurator()) {
      this.advanceState();
    }
  };

  onStateStart = () => {
    this.room.setPhase(new Phase(PhaseType.LOBBY));
    this.room.clearSubmittedPlayers();
  };

  onStateEnd = () => {
    return;
  };

  advanceState = () => {
    this.room.allocate();
    this.room.incrementRound();
    this.room.setCurrPrompts();
    this.room.setDrawState();
  };
}

export default LobbyState;
