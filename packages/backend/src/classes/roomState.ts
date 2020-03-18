import { Schema, ArraySchema, MapSchema, type } from '@colyseus/schema';
import Chain from './subSchema/chain';
import Player from './subSchema/player';
import Phase from './subSchema/phase';
import { Client } from 'colyseus';
import DrawState from './stateMachine/drawState';
import EndState from './stateMachine/endState';
import GuessState from './stateMachine/guessState';
import RevealState from './stateMachine/revealState';
import LobbyState from './stateMachine/lobbyState';
import { ClientAction } from '@full-circle/shared/lib/actions';
import {
  IRoomState,
  IPlayer,
  IJoin,
} from '@full-circle/shared/lib/roomState/interfaces';

export interface IState {
  onReceive: (message: ClientAction) => void;
  onJoin: (client: Client, options: IJoin) => void;
  debugTransition: () => string;
}

class RoomState extends Schema implements IState, IRoomState {
  @type('string')
  curator = '';

  @type([Chain])
  chains = new ArraySchema<Chain>();

  @type({ map: Player })
  player = new MapSchema<Player>();

  @type('number')
  round = 0;

  @type(Phase)
  phase = new Phase();

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

  addPlayer = (player: IPlayer): void => {
    const id = player.id;
    this.player[id] = player;
  };

  //State implementations
  onReceive = (message: ClientAction) => {
    this.currState.onReceive(message);
    console.log(message);
  };

  onJoin = (client: Client, options: any) => {
    this.currState.onJoin(client, options);
    console.log('state', this.player, this.curator);
  };

  debugTransition = () => {
    return this.currState.debugTransition();
  };
}

export default RoomState;
