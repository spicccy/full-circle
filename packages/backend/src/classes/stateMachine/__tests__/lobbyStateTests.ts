import { joinGame, startGame } from '@full-circle/shared/lib/actions/client';
import { joinGameError } from '@full-circle/shared/lib/actions/server';
import {
  GameType,
  PhaseType,
  PromptCategory,
  ServerError,
} from '@full-circle/shared/lib/roomState';
import { Mutable } from '@full-circle/shared/lib/testHelpers';
import { partialMock } from '@full-circle/shared/lib/testHelpers';

import { IClient } from '../../../interfaces';
import { mockClient } from '../../helpers/testHelper';
import { IRoomStateBackend } from '../../roomState';
import Phase from '../../subSchema/phase';
import LobbyState from '../lobbyState';

jest.useFakeTimers();

export const testCurator: IClient = partialMock<IClient>({
  ...mockClient,
  id: 'curator',
});

export const testClient: IClient = partialMock<IClient>({
  ...mockClient,
  id: 'player',
});

const mockRoomState = partialMock<IRoomStateBackend>({
  numPlayers: 0,
  getCurator: jest.fn().mockReturnValue(testCurator.id),
  setCurator: jest.fn(),
  setCuratorDisconnected: jest.fn(),
  setCuratorReconnected: jest.fn(),
  addPlayer: jest.fn(),
  removePlayer: jest.fn(),
  sendAction: jest.fn(),
  sendWarning: jest.fn(),
  setDrawState: jest.fn(),
  setPhase: jest.fn(),
  generateChains: jest.fn(),
  incrementRound: jest.fn(),
  settings: {
    gameType: GameType.PROMPT_PACK,
    promptPack: PromptCategory.GENERIC,
    predictableRandomness: true,
  },
});

describe('Lobby State', () => {
  let roomState: Mutable<IRoomStateBackend>;
  let lobbyState: LobbyState;

  beforeEach(() => {
    jest.clearAllMocks();
    roomState = { ...mockRoomState };
    lobbyState = new LobbyState(roomState);
  });

  describe('onJoin', () => {
    it('sets curator if there is none', () => {
      roomState.getCurator = jest.fn().mockReturnValue('');

      lobbyState.onJoin(testCurator);
      expect(roomState.setCurator).toBeCalledWith(testCurator.id);
    });

    it('does not set curator if there is one', () => {
      lobbyState.onJoin(testCurator);
      expect(roomState.setCurator).not.toBeCalled();
    });
  });

  describe('onLeave', () => {
    it('if curator, sets curator to be disconnected', () => {
      lobbyState.onLeave(testCurator, true);
      expect(roomState.setCuratorDisconnected).toBeCalled();
    });

    it('if player, removes player', () => {
      lobbyState.onLeave(testClient, true);
      expect(roomState.removePlayer).toBeCalledWith(testClient.id);
    });
  });

  describe('onReconnect', () => {
    it('if curator, sets curator to be reconnected', () => {
      lobbyState.onReconnect(testCurator);
      expect(roomState.setCuratorReconnected).toBeCalled();
    });
  });

  describe('onReceive', () => {
    describe('startGame', () => {
      it('sends warning if less than 3 people', () => {
        roomState.numPlayers = 2;

        lobbyState.onReceive(testCurator, startGame());
        expect(roomState.sendWarning).toBeCalledWith(
          testCurator.id,
          ServerError.NOT_ENOUGH_PLAYERS
        );
        expect(roomState.setDrawState).not.toBeCalled();
      });

      it('advances state if 3 or more people', () => {
        roomState.numPlayers = 3;

        lobbyState.onReceive(testCurator, startGame());
        expect(roomState.sendWarning).not.toBeCalled();
        expect(roomState.setDrawState).toBeCalled();
      });
    });

    describe('joinGame', () => {
      it('should add a player', () => {
        lobbyState.onReceive(testClient, joinGame({ username: 'toe' }));
        expect(roomState.addPlayer).toBeCalledWith(testClient.id, 'toe');
      });

      it('sends error to client if there is an error', () => {
        roomState.addPlayer = jest
          .fn()
          .mockReturnValue(ServerError.CONFLICTING_USERNAMES);

        lobbyState.onReceive(testClient, joinGame({ username: 'toe' }));
        expect(roomState.addPlayer).toBeCalledWith(testClient.id, 'toe');
        expect(roomState.sendAction).toBeCalledWith(
          testClient.id,
          joinGameError(ServerError.CONFLICTING_USERNAMES)
        );
      });
    });
  });

  describe('onStateStart', () => {
    it('should set phase to Lobby', () => {
      jest.spyOn(Date, 'now').mockReturnValue(10000);
      lobbyState.onStateStart();
      expect(roomState.setPhase).toBeCalledWith(new Phase(PhaseType.LOBBY));
    });
  });

  describe('advanceState', () => {
    it('should generate chains', () => {
      lobbyState.advanceState();
      expect(roomState.generateChains).toBeCalled();
    });

    it('should increment and move to draw phase', () => {
      lobbyState.advanceState();
      expect(roomState.incrementRound).toBeCalled();
      expect(roomState.setDrawState).toBeCalled();
    });
  });
});
