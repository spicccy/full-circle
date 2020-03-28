import { ClientAction } from '@full-circle/shared/lib/actions';
import { IJoinOptions } from '@full-circle/shared/lib/join/interfaces';
import { PhaseType } from '@full-circle/shared/lib/roomState/constants';

import { MAX_PLAYERS } from '../../constants';
import { IClient } from '../../interfaces';
import RoomState, { IState } from '../roomState';
import Phase, { DEFAULT_DRAW_PHASE_LENGTH } from '../subSchema/phase';
import Player from './../subSchema/player';
import DrawState from './drawState';
import EndState from './endState';

class LobbyState implements IState {
  private room: RoomState;

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
    if (clientId === this.room.curator) {
      this.advanceState();
    }
  };

  advanceState = () => {
    this.room.round = 1;
    this.room.phase = new Phase(PhaseType.DRAW, DEFAULT_DRAW_PHASE_LENGTH);
    this.room.currState = new DrawState(this.room);
  };
}

export default LobbyState;
