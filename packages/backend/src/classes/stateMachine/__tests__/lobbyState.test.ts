import RoomState from '../../roomState';
import LobbyState from '../lobbyState';
import { IClient } from '../../../interfaces';
import { IJoinOptions } from '@full-circle/shared/lib/join/interfaces';
import { MAX_PLAYERS } from '../../../constants';

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
      close: () => {
        return;
      },
    };

    room.setCurator('something');

    const lobbyState = new LobbyState(room);
    const option: IJoinOptions = { username: 'whatup' };
    lobbyState.onJoin(testClient, option);

    expect(spyAddPlayer).toBeCalledTimes(1);
    expect(spyAddPlayer).toBeCalledWith({
      id: 'something',
      username: 'whatup',
    });
  });

  it('Not more than 8 players can join', () => {
    const mockClose = jest.fn();

    const testClient: IClient = {
      id: 'something',
      sessionId: 'abcd',
      close: mockClose,
    };
    const room = new RoomState();
    room.setCurator('something');

    const lobbyState = new LobbyState(room);
    const option: any = { username: 'whatup' };

    for (let i = 0; i < MAX_PLAYERS; i++) {
      lobbyState.onJoin(
        {
          id: `something${i}`,
          sessionId: 'abcd',
          close: mockClose,
        },
        option
      );
    }

    expect(mockClose).toBeCalledTimes(0);

    lobbyState.onJoin(testClient, option);

    expect(mockClose).toBeCalledTimes(1);
  });
});
