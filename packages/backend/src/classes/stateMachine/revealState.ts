import { ClientAction } from '@full-circle/shared/lib/actions';
import { revealChain } from '@full-circle/shared/lib/actions/client';
import { warn } from '@full-circle/shared/lib/actions/server';
import { formatUsername } from '@full-circle/shared/lib/helpers';
import { IJoinOptions } from '@full-circle/shared/lib/join/interfaces';
import { PhaseType, RoomErrorType } from '@full-circle/shared/lib/roomState';
import { getType } from 'typesafe-actions';

import { IClient } from '../../interfaces';
import { throwJoinRoomError } from '../../util/util';
import { IRoomStateBackend, IState } from '../roomState';
import Phase from '../subSchema/phase';

class RevealState implements IState {
  constructor(private roomState: IRoomStateBackend) {}

  onJoin = (_client: IClient, options: IJoinOptions) => {
    this.roomState.attemptReconnection(formatUsername(options.username));
    throwJoinRoomError(warn(RoomErrorType.GAME_ALREADY_STARTED));
  };

  onLeave = (client: IClient, _consented: boolean) => {
    this.roomState.setPlayerDisconnected(client.id);
    return true;
  };

  onReceive = (_client: IClient, message: ClientAction) => {
    switch (message.type) {
      case getType(revealChain): {
        const revealed = this.roomState.revealNext();
        if (!revealed) {
          this.advanceState();
        }
        return;
      }
    }
  };

  onClientReady = (clientId: string) => {
    if (clientId === this.roomState.getCurator()) {
      this.advanceState();
    }
  };

  onStateStart = () => {
    this.roomState.setPhase(new Phase(PhaseType.REVEAL));
    this.roomState.revealNext();
  };

  onStateEnd = () => {
    return;
  };

  advanceState = () => {
    this.roomState.setEndState();
  };
}

export default RevealState;
