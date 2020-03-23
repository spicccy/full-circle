import RoomState from '../../roomState';
import LobbyState from '../lobbyState';
import { IClient } from '../../../interfaces';

const room = new RoomState();
const spySetCurator = jest.spyOn(room, 'setCurator'); // spy on foo.addListener
const spyAddPlayer = jest.spyOn(room, 'addPlayer');

describe('Lobby state test', () => {
  it('Can add a curator', () => {
    const testClient: any = {
      id: 'something',
      sessionId: 'abcd',
    };

    const lobbyState = new LobbyState(room);
    const option: any = {};
    lobbyState.onJoin(testClient, option);

    expect(spySetCurator).toBeCalledTimes(1);
    expect(spySetCurator).toBeCalledWith('something');
  });

  it('Can add a player', () => {
    const testClient: IClient = {
      id: 'something',
      sessionId: 'abcd',
    };

    room.setCurator('something');

    const lobbyState = new LobbyState(room);
    const option: any = { username: 'whatup' };
    lobbyState.onJoin(testClient, option);

    expect(spyAddPlayer).toBeCalledTimes(1);
    expect(spyAddPlayer).toBeCalledWith({
      id: 'something',
      username: 'whatup',
    });
  });
});
