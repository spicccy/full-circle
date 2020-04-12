import { ClientAction } from '@full-circle/shared/lib/actions';
import {
  createPreRoomMessage,
  IJoinOptions,
  PRE_ROOM_MESSAGE,
} from '@full-circle/shared/lib/join/interfaces';
import { PhaseType } from '@full-circle/shared/lib/roomState/constants';
import { Warning } from '@full-circle/shared/lib/roomState/interfaces';

import { IClient } from '../../interfaces';
import { IRoomStateBackend, IState } from '../roomState';
import Phase from '../subSchema/phase';

class EndState implements IState {
  constructor(private roomState: IRoomStateBackend) {}

  onJoin = (client: IClient, options: IJoinOptions) => {
    const username = options.username;
    // see if the player had previously been in the lobby
    const maybeExistingId = this.roomState.getReconnectableId(username);
    if (maybeExistingId) {
      // throw an error since we can't message them till they are in the room
      throw new Error(
        createPreRoomMessage(
          PRE_ROOM_MESSAGE.RECONNECT_COMMAND,
          maybeExistingId
        )
      );
    }
    throw new Error(Warning.GAME_ALREADY_STARTED);
  };

  onLeave = (client: IClient, _consented: boolean) => {
    this.roomState.playerDisconnected(client.id);
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
