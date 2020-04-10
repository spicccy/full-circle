import { ClientAction } from '@full-circle/shared/lib/actions';
import { PhaseType } from '@full-circle/shared/lib/roomState/constants';
import { Warning } from '@full-circle/shared/lib/roomState/interfaces';

import { IClient } from '../../interfaces';
import { IRoomStateBackend, IState } from '../roomState';
import Phase from '../subSchema/phase';

class RevealState implements IState {
  constructor(private roomState: IRoomStateBackend) {}

  onJoin = () => {
    throw new Error(Warning.GAME_ALREADY_STARTED);
  };

  onLeave = (client: IClient, _consented: boolean) => {
    this.roomState.removePlayer(client.id);
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
    this.roomState.setPhase(new Phase(PhaseType.REVEAL));
    this.roomState.clearSubmittedPlayers();
  };

  onStateEnd = () => {
    return;
  };

  advanceState = () => {
    this.roomState.setEndState();
  };
}

export default RevealState;
