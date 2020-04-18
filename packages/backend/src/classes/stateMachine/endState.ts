import { ClientAction } from '@full-circle/shared/lib/actions';
import { warn } from '@full-circle/shared/lib/actions/server';
import { IJoinOptions } from '@full-circle/shared/lib/join/interfaces';
import { PhaseType } from '@full-circle/shared/lib/roomState/constants';
import { RoomErrorType } from '@full-circle/shared/lib/roomState/interfaces';

import { IClient } from '../../interfaces';
import { IRoomStateBackend, IState } from '../roomState';
import Phase from '../subSchema/phase';

class EndState implements IState {
  constructor(private roomState: IRoomStateBackend) {}

  onJoin = (_client: IClient, options: IJoinOptions) => {
    this.roomState.attemptReconnection(options.username);
    this.roomState.throwJoinRoomError(warn(RoomErrorType.GAME_ALREADY_STARTED));
  };

  onLeave = (client: IClient, _consented: boolean) => {
    this.roomState.setPlayerDisconnected(client.id);
    return true;
  };

  onReceive = (client: IClient, message: ClientAction) => {
    console.log(client, message);
  };

  onClientReady = (clientId: string) => {
    if (clientId === this.roomState.getCurator()) {
      this.advanceState();
    }
  };

  onStateStart = () => {
    this.roomState.setPhase(new Phase(PhaseType.END));
    this.roomState.clearSubmittedPlayers();
  };

  onStateEnd = () => {
    return;
  };

  advanceState = () => {
    return;
  };
}

export default EndState;
