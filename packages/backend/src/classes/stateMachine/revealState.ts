import { ClientAction } from '@full-circle/shared/lib/actions';
import { PhaseType } from '@full-circle/shared/lib/roomState/constants';

import { IClient } from '../../interfaces';
import { IRoomStateBackend, IState } from '../roomState';
import Phase from '../subSchema/phase';

class RevealState implements IState {
  constructor(private room: IRoomStateBackend) {}

  onJoin = () => {
    throw new Error('Game has already started');
  };

  onLeave = (client: IClient, _consented: boolean) => {
    this.room.removePlayer(client.id);
  };

  onReceive = (client: IClient, message: ClientAction) => {
    console.log(client, message);
  };

  onClientReady = (clientId: string) => {
    if (clientId === this.room.getCurator()) {
      this.advanceState();
    }
  };

  onStateStart = () => {
    this.room.setPhase(new Phase(PhaseType.REVEAL));
  };

  onStateEnd = () => {
    return;
  };

  advanceState = () => {
    this.room.setEndState();
  };
}

export default RevealState;
