import RoomState from '../../roomState';
import LobbyState from '../lobbyState';
import { IClient } from '../../../interfaces';
import * as ClientHelpers from '../../../helpers/clientHelpers';

const room = new RoomState();
const spySetCurator = jest.spyOn(room, 'setCurator'); // spy on foo.addListener
const spyAddPlayer = jest.spyOn(room, 'addPlayer');
const spyCloseClient = jest.spyOn(ClientHelpers, 'closeClient');

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
      close: () => {
        return;
      },
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

  it('Not more than 8 players can join', () => {
    const testClient: IClient = {
      id: 'something',
      sessionId: 'abcd',
      close: () => {
        return;
      },
    };
    const room = new RoomState();
    room.setCurator('something');

    const lobbyState = new LobbyState(room);
    const option: any = { username: 'whatup' };

    for (let i = 0; i < 8; i++) {
      lobbyState.onJoin(
        {
          id: `something${i}`,
          sessionId: 'abcd',
          close: () => {
            return;
          },
        },
        option
      );
    }

    expect(spyCloseClient).toBeCalledTimes(0);

    lobbyState.onJoin(testClient, option);

    expect(spyCloseClient).toBeCalledTimes(1);
    expect(spyCloseClient).toBeCalledWith(testClient);
  });
});
