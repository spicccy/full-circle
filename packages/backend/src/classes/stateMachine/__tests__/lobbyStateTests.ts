import { joinGame, startGame } from '@full-circle/shared/lib/actions/client';
import { joinGameError } from '@full-circle/shared/lib/actions/server';
import { Category } from '@full-circle/shared/lib/prompts';
import { PhaseType, ServerError } from '@full-circle/shared/lib/roomState';
import { Mutable } from '@full-circle/shared/lib/testHelpers';
import { partialMock } from '@full-circle/shared/lib/testHelpers';
import { mocked } from 'ts-jest/utils';

import { IClient } from '../../../interfaces';
import { mockClient } from '../../helpers/testHelper';
import { PromptManager } from '../../managers/promptManager/promptManager';
import { IRoomStateBackend } from '../../roomState';
import Phase from '../../subSchema/phase';
import LobbyState from '../lobbyState';

jest.mock('../../managers/promptManager/promptManager');

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
  settings: {
    promptPack: Category.GENERIC,
    predictableRandomness: true,
  },
  generateChains: jest.fn(),
  incrementRound: jest.fn(),
});

const mockGetPrompts = jest.fn().mockReturnValue(['abc']);
mocked(PromptManager).mockImplementation(() => {
  return partialMock({ getInitialPrompts: mockGetPrompts });
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
      roomState.numPlayers = 3;

      lobbyState.advanceState();
      expect(PromptManager).toBeCalledWith({
        category: Category.GENERIC,
        testing: true,
      });
      expect(mockGetPrompts).toBeCalledWith(3);
      expect(roomState.generateChains).toBeCalledWith(['abc']);
    });

    it('should increment and move to draw phase', () => {
      lobbyState.advanceState();
      expect(roomState.incrementRound).toBeCalled();
      expect(roomState.setDrawState).toBeCalled();
    });
  });
});
