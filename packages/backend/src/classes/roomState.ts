import { ArraySchema, MapSchema, Schema, type } from '@colyseus/schema';
import { ClientAction } from '@full-circle/shared/lib/actions';
import { IJoinOptions } from '@full-circle/shared/lib/join/interfaces';
import {
  IPlayer,
  IRoomState,
} from '@full-circle/shared/lib/roomState/interfaces';

import { IClient } from '../interfaces';
import DrawState from './stateMachine/drawState';
import EndState from './stateMachine/endState';
import GuessState from './stateMachine/guessState';
import LobbyState from './stateMachine/lobbyState';
import RevealState from './stateMachine/revealState';
import Chain from './subSchema/chain';
import Phase from './subSchema/phase';
import Player from './subSchema/player';

export interface IState {
  onReceive: (message: ClientAction) => void;
  onJoin: (client: IClient, options: IJoinOptions) => void;
  debugTransition: () => string;
}

class RoomState extends Schema implements IState, IRoomState {
  @type('string')
  curator = '';

  @type([Chain])
  chains = new ArraySchema<Chain>();

  @type({ map: Player })
  players = new MapSchema<Player>();

  @type('number')
  round = 0;

  @type(Phase)
  phase = new Phase(60);

  currState = new LobbyState(this);

  setDrawState = () => {
    this.currState = new DrawState(this);
  };

  setEndState = () => {
    this.currState = new EndState(this);
  };

  setGuessState = () => {
    this.currState = new GuessState(this);
  };

  setRevealState = () => {
    this.currState = new RevealState(this);
  };

  setLobbyState = () => {
    this.currState = new LobbyState(this);
  };

  //helpers

  setCurator = (id: string): void => {
    this.curator = id;
  };

  getCurator = (): string => {
    return this.curator;
  };

  addPlayer = (player: IPlayer): void => {
    const id = player.id; //Using Colyseus assigned unique id, no checks needed
    this.players[id] = player;
  };

  getPlayer = (id: string): IPlayer => {
    return this.players[id];
  };

  get numPlayers() {
    return Object.keys(this.players).length;
  }

  //State implementations
  onReceive = (message: ClientAction) => {
    this.currState.onReceive(message);
    console.log(message);
  };

  onJoin = (client: IClient, options: IJoinOptions) => {
    this.currState.onJoin(client, options);
  };

  debugTransition = () => {
    return this.currState.debugTransition();
  };
}

export default RoomState;
