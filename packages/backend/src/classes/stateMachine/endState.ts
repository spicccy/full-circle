import { ClientAction } from '@full-circle/shared/lib/actions';
import { PhaseType } from '@full-circle/shared/lib/roomState';

import { IClient } from '../../interfaces';
import { IRoomStateBackend, IState } from '../roomState';
import Phase from '../subSchema/phase';

class EndState implements IState {
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
    console.log(client, message);
  };

  onStateStart = () => {
    this.roomState.setPhase(new Phase(PhaseType.END));
  };

  onStateEnd = () => {};

  advanceState = () => {};
}

export default EndState;
