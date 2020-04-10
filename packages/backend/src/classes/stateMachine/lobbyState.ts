import { ClientAction } from '@full-circle/shared/lib/actions';
import { notifyPlayerReady } from '@full-circle/shared/lib/actions/client';
import { IJoinOptions } from '@full-circle/shared/lib/join/interfaces';
import { PhaseType } from '@full-circle/shared/lib/roomState/constants';
import { Warning } from '@full-circle/shared/lib/roomState/interfaces';
import { getType } from 'typesafe-actions';

import { MAX_PLAYERS } from '../../constants';
import { IClient } from '../../interfaces';
import { IRoomStateBackend, IState } from '../roomState';
import Phase from '../subSchema/phase';
import Player from './../subSchema/player';

class LobbyState implements IState {
  constructor(private roomState: IRoomStateBackend) {}

  onJoin = (client: IClient, options: IJoinOptions) => {
    const username = options.username;
    const clientId = client.id;

    if (this.roomState.numPlayers >= MAX_PLAYERS) {
      client.close();
      return;
    }

    if (!this.roomState.getCurator()) {
      this.roomState.setCurator(clientId);
      return;
    }

    const player = new Player(clientId, username);
    if (!this.roomState.addPlayer(player)) {
      // message the user that their name is invalid
      return;
    }

    this.roomState.addSubmittedPlayer(player.id);

    // TODO: TESTS CHAIN ALLOCATION DELETE THIS
    if (this.roomState.numPlayers == 5) {
      this.roomState.allocate();
    }
  };

  onLeave = (client: IClient, _consented: boolean) => {
    this.roomState.removePlayer(client.id);
  };

  onReceive = (client: IClient, message: ClientAction) => {
    switch (message.type) {
      case getType(notifyPlayerReady): {
        this.onClientReady(client.id);
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
    this.roomState.setPhase(new Phase(PhaseType.LOBBY));
    this.roomState.clearSubmittedPlayers();
  };

  onStateEnd = () => {
    return;
  };

  validateLobby = (): boolean => {
    let retval = true;
    if (this.roomState.numPlayers < 3) {
      this.roomState.addWarning(
        Warning.NOT_ENOUGH_PLAYERS,
        'You need at least three players to start a game'
      );
      retval = false;
    } else {
      this.roomState.clearWarning(Warning.NOT_ENOUGH_PLAYERS);
    }
    if (this.roomState.hasConflictingUsernames) {
      this.roomState.addWarning(
        Warning.CONFLICTING_USERNAMES,
        'Some players have conflicting usernames'
      );
      retval = false;
    } else {
      this.roomState.clearWarning(Warning.CONFLICTING_USERNAMES);
    }

    return retval;
  };

  advanceState = () => {
    if (this.validateLobby()) {
      this.roomState.allocate();
      this.roomState.incrementRound();
      this.roomState.setCurrPrompts();
      this.roomState.setDrawState();
    }
  };
}

export default LobbyState;
