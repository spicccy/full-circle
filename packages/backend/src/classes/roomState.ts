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

export interface IState {
  onReceive: (message: ClientAction) => void;
  onJoin: (client: Client) => void;
  debugTransition: () => string;
}

class RoomState extends Schema implements IState {
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

  setCurator = (id: string) => {
    this.curator = id;
  };

  //Interface implementations

  onReceive = (message: ClientAction) => {
    this.currState.onReceive(message);
    console.log(message);
  };

  onJoin = (client: Client) => {
    this.currState.onJoin(client);
    console.log(client);
  };

  debugTransition = () => {
    return this.currState.debugTransition();
  };
}

export default RoomState;
