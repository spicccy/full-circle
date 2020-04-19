import { ClientAction } from '@full-circle/shared/lib/actions';
import {
  changeRoomSetting,
  notifyPlayerReady,
} from '@full-circle/shared/lib/actions/client';
import { warn } from '@full-circle/shared/lib/actions/server';
import { formatUsername } from '@full-circle/shared/lib/helpers';
import { IJoinOptions } from '@full-circle/shared/lib/join/interfaces';
import { RoomSettingRequestType } from '@full-circle/shared/lib/roomSettings';
import { PhaseType, RoomErrorType } from '@full-circle/shared/lib/roomState';
import { getType } from 'typesafe-actions';

import { IClient } from '../../interfaces';
import { SettingsManager } from '../managers/settingsManager/settingsManager';
import { throwJoinRoomError } from '../../util/util';
import { IRoomStateBackend, IState } from '../roomState';
import Phase from '../subSchema/phase';
import Player from './../subSchema/player';

class LobbyState implements IState {
  settingsManager = new SettingsManager();

  constructor(private roomState: IRoomStateBackend) {}

  onJoin = (client: IClient, options: IJoinOptions) => {
    const username = formatUsername(options.username);
    const clientId = client.id;

    if (!this.roomState.getCurator()) {
      this.roomState.setCurator(clientId);
      return;
    }

    const player = new Player(clientId, username);

    const error = this.roomState.addPlayer(player);
    if (error) {
      throwJoinRoomError(warn(error));
    }

    this.roomState.addSubmittedPlayer(player.id);
  };

  onLeave = (client: IClient, _consented: boolean) => {
    this.roomState.removePlayer(client.id);
    return false;
  };

  onReceive = (client: IClient, message: ClientAction) => {
    switch (message.type) {
      case getType(notifyPlayerReady): {
        this.onClientReady(client.id);
        return;
      }

      case getType(changeRoomSetting): {
        const { payload } = message;
        switch (payload.setting) {
          case RoomSettingRequestType.PROMPT_PACK:
            this.settingsManager.setPromptPack(payload.value);
        }
        return;
      }
    }
  };

  onClientReady = (clientId: string) => {
    if (clientId === this.roomState.getCurator() && this.validateLobby()) {
      this.advanceState();
    }
  };

  onStateStart = () => {
    this.roomState.setPhase(new Phase(PhaseType.LOBBY));
    this.roomState.clearSubmittedPlayers();
  };

  onStateEnd = () => {
    this.roomState.clearSubmittedPlayers();

    // assume settings have been configured
    const prompts = this.settingsManager.getInitialPrompts(
      this.roomState.numPlayers
    );
    this.roomState.generateChains(prompts);
  };

  validateLobby = (): boolean => {
    if (this.roomState.numPlayers < 3) {
      this.roomState.sendWarning(
        this.roomState.getCurator(),
        RoomErrorType.NOT_ENOUGH_PLAYERS
      );
      return false;
    }

    return true;
  };

  advanceState = () => {
    this.roomState.incrementRound();
    this.roomState.setDrawState();
  };
}

export default LobbyState;
