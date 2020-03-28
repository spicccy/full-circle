import { ArraySchema, MapSchema, Schema, type } from '@colyseus/schema';
import { ClientAction } from '@full-circle/shared/lib/actions';
import { IJoinOptions } from '@full-circle/shared/lib/join/interfaces';
import { PhaseType } from '@full-circle/shared/lib/roomState/constants';
import {
  IPlayer,
  IRoomState,
} from '@full-circle/shared/lib/roomState/interfaces';

import { IClient } from '../interfaces';
import LobbyState from './stateMachine/lobbyState';
import Chain from './subSchema/chain';
import Phase from './subSchema/phase';
import Player from './subSchema/player';

export interface IState {
  onReceive: (message: ClientAction) => void;
  onJoin: (client: IClient, options: IJoinOptions) => void;
  advanceState: () => void;
  onClientReady: (clientId: string) => void;
}

class RoomState extends Schema implements IState, IRoomState {
  @type('string')
  curator = '';

  @type([Chain])
  chains = new ArraySchema<Chain>();

  @type({ map: Player })
  players = new MapSchema<Player>();

  @type({ map: Player })
  readyPlayers = new MapSchema<Player>();

  @type('number')
  round = 0;

  @type(Phase)
  phase = new Phase(PhaseType.LOBBY);

  currState: IState = new LobbyState(this);

  setCurator = (id: string): void => {
    this.curator = id;
  };

  getCurator = (): string => {
    return this.curator;
  };

  addPlayer = (player: IPlayer): void => {
    const { id } = player;
    this.players[id] = player;
  };

  removePlayer = (playerId: string) => {
    delete this.players[playerId];
    delete this.readyPlayers[playerId];
  };

  onClientReady = (clientId: string): void => {
    this.currState.onClientReady(clientId);
  };

  getPlayer = (id: string): IPlayer => {
    return this.players[id];
  };

  get numPlayers() {
    return Object.keys(this.players).length;
  }

  get numReadyPlayers() {
    return Object.keys(this.readyPlayers).length;
  }

  //State implementations
  onReceive = (message: ClientAction) => {
    this.currState.onReceive(message);
    console.log(message);
  };

  onJoin = (client: IClient, options: IJoinOptions) => {
    this.currState.onJoin(client, options);
  };

  advanceState = () => {
    this.currState.advanceState();
  };
}

export default RoomState;
