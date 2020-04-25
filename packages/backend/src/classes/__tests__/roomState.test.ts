import { PhaseType } from '@full-circle/shared/lib/roomState';
import { mocked } from 'ts-jest/utils';

import { addPlayers, mockRoom } from '../helpers/testHelper';
import RoomState from '../roomState';
import { getAllocation } from './../../util/sortPlayers/sortPlayers';

jest.mock('./../../util/sortPlayers/sortPlayers');

describe('Room state', () => {
  describe('transitions', () => {
    let state: RoomState;

    beforeEach(() => {
      state = new RoomState(mockRoom);
      addPlayers(state, 10);

      const mockedVal = [
        ['a', 'b', 'c', 'd', 'e'],
        ['e', 'd', 'b', 'a', 'c'],
      ];
      mocked(getAllocation).mockReturnValue(() => {
        return mockedVal;
      });
      jest.spyOn(state, 'updatePlayerScores').mockImplementation(() => null);
    });

    it('starts with the lobby state', () => {
      expect(state.phase.phaseType).toBe(PhaseType.LOBBY);
    });

    it('transitions from lobby state to draw state', () => {
      state.advanceState();
      expect(state.phase.phaseType).toBe(PhaseType.DRAW);
    });

    it('transitions from draw state to guess state', () => {
      state.advanceState();
      state.advanceState();
      expect(state.phase.phaseType).toBe(PhaseType.GUESS);
    });

    it('transitions from guess state to draw state', () => {
      state.advanceState();
      state.advanceState();
      state.advanceState();
      expect(state.phase.phaseType).toBe(PhaseType.DRAW);
    });

    it('should increment the round when a guess/draw cycle is over', () => {
      expect(state.round).toBe(0);
    });

    it('starts with the lobby state', () => {
      expect(state.phase.phaseType).toBe(PhaseType.LOBBY);
    });

    it('transitions from lobby state to draw state', () => {
      state.advanceState();
      expect(state.phase.phaseType).toBe(PhaseType.DRAW);
    });

    it('transitions from draw state to guess state', () => {
      state.advanceState();
      state.advanceState();
      expect(state.phase.phaseType).toBe(PhaseType.GUESS);
    });

    it('transitions from guess state to draw state', () => {
      state.advanceState();
      state.advanceState();
      state.advanceState();
      expect(state.phase.phaseType).toBe(PhaseType.DRAW);
    });

    it('should increment the round when a guess/draw cycle is over', () => {
      expect(state.round).toBe(0);

      state.advanceState();
      expect(state.round).toBe(1);

      state.advanceState();
      expect(state.round).toBe(2);

      state.advanceState();
      expect(state.round).toBe(3);
    });
  });

  describe('it should automatically end the game loop', () => {
    let roomState: RoomState;

    beforeEach(() => {
      roomState = new RoomState(mockRoom);
      jest
        .spyOn(roomState, 'updatePlayerScores')
        .mockImplementation(() => null);
    });

    it('ends the game loop correctly when there are three players', () => {
      addPlayers(roomState, 3);
      expect(roomState.phase.phaseType).toBe(PhaseType.LOBBY);
      roomState.advanceState(); // LOBBY => DRAW
      expect(roomState.phase.phaseType).toBe(PhaseType.DRAW);
      roomState.advanceState(); // Player one draws: DRAW => GUESS
      expect(roomState.phase.phaseType).toBe(PhaseType.GUESS);
      roomState.advanceState(); // Player two guesses: GUESS => DRAW
      expect(roomState.phase.phaseType).toBe(PhaseType.DRAW);
      roomState.advanceState(); // Player three draws: DRAW => REVEAL
      expect(roomState.phase.phaseType).toBe(PhaseType.REVEAL);
    });

    it('ends the game loop correctly when there are four players', () => {
      addPlayers(roomState, 4);
      roomState.advanceState(); // LOBBY => DRAW
      roomState.advanceState(); // Player one draws: DRAW => GUESS
      roomState.advanceState(); // Player two guesses: GUESS => DRAW
      roomState.advanceState(); // Player three draws: DRAW => GUESS
      roomState.advanceState(); // Player four guesses: GUESS => REVEAL

      expect(roomState.phase.phaseType).toBe(PhaseType.REVEAL);
    });
  });

  describe('should store', () => {
    let roomState: RoomState;

    beforeEach(() => {
      roomState = new RoomState(mockRoom);
      const mockedVal = [
        ['a', 'b', 'c', 'd', 'e'],
        ['e', 'd', 'b', 'a', 'c'],
      ];
      mocked(getAllocation).mockReturnValue(() => {
        return mockedVal;
      });
    });

    it('the prompt in the correct link', () => {
      roomState.advanceState();
      roomState.storeDrawing('a', { data: 'hello' } as any);
      expect(roomState.chains[0].links[1].playerId).toEqual('a');
      expect(roomState.chains[0].links[1].data).toEqual(
        JSON.stringify({ data: 'hello' })
      );
    });

    it('the image in the correct link', () => {
      roomState.advanceState();
      roomState.advanceState();
      roomState.storeGuess('b', 'hello');
      expect(roomState.chains[0].links[2].playerId).toEqual('b');
      expect(roomState.chains[0].links[2].data).toEqual('hello');
    });
  });

  describe('should updates round data', () => {
    let roomState: RoomState;

    beforeEach(() => {
      roomState = new RoomState(mockRoom);
      addPlayers(roomState, 3);
      const mockedVal = [
        ['0_id', '1_id', '2_id'],
        ['1_id', '2_id', '0_id'],
        ['2_id', '0_id', '1_id'],
      ];
      mocked(getAllocation).mockReturnValue(() => {
        return mockedVal;
      });

      roomState.advanceState();
      roomState.storeDrawing('0_id', { lol: '1' } as any);
      roomState.storeDrawing('1_id', { lol: '2' } as any);
    });

    it.only('image data', () => {
      roomState.advanceState();
      expect(roomState.getPlayer('1_id')?.roundData?.data).toEqual(
        JSON.stringify({ lol: '1' })
      );
      expect(roomState.getPlayer('2_id')?.roundData?.data).toEqual(
        JSON.stringify({ lol: '2' })
      );
    });

    it('prompt data', () => {
      roomState.advanceState();
      roomState.storeGuess('1_id', 'prompt1');
      roomState.storeGuess('2_id', 'prompt2');
      roomState.advanceState();
      expect(roomState.getPlayer('2_id')?.roundData?.data).toEqual('prompt1');
      expect(roomState.getPlayer('0_id')?.roundData?.data).toEqual('prompt2');
    });
  });
});
