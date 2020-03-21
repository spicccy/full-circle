import RoomState from '../../roomState';
import LobbyState from '../lobbyState';

const foo = new RoomState();
const spySetCurator = jest.spyOn(foo, 'setCurator'); // spy on foo.addListener
const spyAddPlayer = jest.spyOn(foo, 'addPlayer');

describe('Lobby state test', () => {
  it('Can add a curator', () => {
    const testClient: any = {
      id: 'something',
      sessionId: 'abcd',
    };

    const lobbyState = new LobbyState(foo);
    const option: any = {};
    lobbyState.onJoin(testClient, option);

    expect(spySetCurator).toBeCalledTimes(1);
    expect(spySetCurator).toBeCalledWith('something');
  });

  it('Can add a player', () => {
    const testClient: any = {
      id: 'something',
      sessionId: 'abcd',
    };

    const lobbyState = new LobbyState(foo);
    const option: any = { username: 'whatup' };
    lobbyState.onJoin(testClient, option);

    expect(spyAddPlayer).toBeCalledTimes(1);
    expect(spyAddPlayer).toBeCalledWith({
      id: 'something',
      username: 'whatup',
    });
  });
});
