import { ClientAction } from '@full-circle/shared/lib/actions';
import { revealChain } from '@full-circle/shared/lib/actions/client';
import {
  sendReconnect,
  throwServerWarning,
} from '@full-circle/shared/lib/actions/server';
import { IJoinOptions } from '@full-circle/shared/lib/join/interfaces';
import { PhaseType } from '@full-circle/shared/lib/roomState/constants';
import { RoomErrorType } from '@full-circle/shared/lib/roomState/interfaces';
import { getType } from 'typesafe-actions';

import { IClient } from '../../interfaces';
import { IRoomStateBackend, IState } from '../roomState';
import Phase from '../subSchema/phase';

class RevealState implements IState {
  constructor(private roomState: IRoomStateBackend) {}

  onJoin = (_client: IClient, options: IJoinOptions) => {
    const username = options.username;
    // see if the player had previously been in the lobby
    const maybeExistingId = this.roomState.attemptReconnection(username);
    if (maybeExistingId) {
      // throw an error since we can't message them till they are in the room
      sendReconnect(maybeExistingId);
    }
    throwServerWarning(RoomErrorType.GAME_ALREADY_STARTED);
  };

  onLeave = (client: IClient, _consented: boolean) => {
    this.roomState.playerDisconnected(client.id);
  };

  onReceive = (_client: IClient, message: ClientAction) => {
    switch (message.type) {
      case getType(revealChain): {
        const revealed = this.roomState.sendReveal();
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
    this.roomState.sendReveal();
  };

  onStateEnd = () => {
    return;
  };

  advanceState = () => {
    this.roomState.setEndState();
  };
}

export default RevealState;
