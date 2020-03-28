import { ClientAction } from '@full-circle/shared/lib/actions';
import { IJoinOptions } from '@full-circle/shared/lib/join/interfaces';
import { PhaseType } from '@full-circle/shared/lib/roomState/constants';

import { MAX_PLAYERS } from '../../constants';
import { IClient } from '../../interfaces';
import RoomState, { IRoomStateBackend,IState } from '../roomState';
import Phase, { DEFAULT_DRAW_PHASE_LENGTH } from '../subSchema/phase';
import Player from './../subSchema/player';
import DrawState from './drawState';

class LobbyState implements IState {
  private room: IRoomStateBackend;

  constructor(room: RoomState) {
    this.room = room;
  }

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
  };

  onLeave = (client: IClient, _consented: boolean) => {
    this.room.removePlayer(client.id);
  };

  onReceive = (message: ClientAction) => {
    console.log(message);
  };

  onClientReady = (clientId: string) => {
    if (clientId === this.room.getCurator()) {
      this.advanceState();
    }
  };

  advanceState = () => {
    this.room.incrementRound();
    this.room.setDrawState();
  };
}

export default LobbyState;
