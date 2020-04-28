import { ClientAction } from '@full-circle/shared/lib/actions';
import { revealChain, vote } from '@full-circle/shared/lib/actions/client';
import { PhaseType } from '@full-circle/shared/lib/roomState';
import { getType } from 'typesafe-actions';

import { IClient } from '../../interfaces';
import { IRoomStateBackend, IState } from '../roomState';
import Phase from '../subSchema/phase';

class RevealState implements IState {
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
    switch (message.type) {
      case getType(revealChain): {
        const revealed = this.roomState.revealNext();
        if (!revealed) {
          this.advanceState();
        }
        return;
      }
      case getType(vote): {
        this.roomState.addVote(client.id, message.payload);
        return;
      }
    }
  };

  onStateStart = () => {
    this.roomState.setPhase(new Phase(PhaseType.REVEAL));
    this.roomState.revealNext();
  };

  onStateEnd = () => {};

  advanceState = () => {
    this.roomState.calculateVotes();
    this.roomState.setEndState();
  };
}

export default RevealState;
