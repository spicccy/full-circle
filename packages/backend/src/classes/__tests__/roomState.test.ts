import { PhaseType } from '@full-circle/shared/lib/roomState/constants';
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
      expect(state.round).toBe(1);

      state.advanceState();
      expect(state.round).toBe(2);
    });
  });

  describe('chain allocation', () => {
    it('can generate chain correctly', () => {
      const roomState = new RoomState(mockRoom);
      const mockedVal = [
        ['a', 'b', 'c', 'd', 'e'],
        ['e', 'd', 'b', 'a', 'c'],
      ];
      mocked(getAllocation).mockReturnValue(() => {
        return mockedVal;
      });

      roomState.allocate();
      const chains = roomState.currChains;
      const chain1 = chains[0];
      expect(chain1.id).toBe('a');
      expect(chain1.links[0].image.playerId).toBe('a');
      expect(chain1.links[0].prompt.playerId).toBe('');
      expect(chain1.links[1].image.playerId).toBe('c');
      expect(chain1.links[1].prompt.playerId).toBe('b');
      expect(chain1.links[2].image.playerId).toBe('e');
      expect(chain1.links[2].prompt.playerId).toBe('d');

      const chain2 = chains[1];
      expect(chain2.id).toBe('e');
      expect(chain2.links[0].image.playerId).toBe('e');
      expect(chain2.links[0].prompt.playerId).toBe('');
      expect(chain2.links[1].image.playerId).toBe('b');
      expect(chain2.links[1].prompt.playerId).toBe('d');
      expect(chain2.links[2].image.playerId).toBe('c');
      expect(chain2.links[2].prompt.playerId).toBe('a');
    });
  });

  describe('it should automatically end the game loop', () => {
    let roomState: RoomState;

    beforeEach(() => {
      roomState = new RoomState(mockRoom);
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

    it('the image in the correct link', () => {
      roomState.allocate();
      roomState.incrementRound();
      roomState.storeGuess('b', 'hello');
      expect(roomState.currChains[0].getLinks[1].prompt.text).toEqual('hello');
    });

    it('the prompt in the correct link', () => {
      roomState.allocate();
      roomState.incrementRound();
      const val: any = { data: 'hello' };
      roomState.storeDrawing('a', val);
      expect(roomState.currChains[0].getLinks[0].image.imageData).toEqual(
        JSON.stringify({ data: 'hello' })
      );
    });
  });

  describe('should send the correct round', () => {
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
      const testData1: any = { lol: 'iunno' };

      roomState.allocate();
      roomState.incrementRound();
      roomState.storeDrawing('a', testData1);
      roomState.storeDrawing('e', testData1);
      roomState.storeGuess('b', 'prompt1');
      roomState.storeGuess('d', 'prompt1');
    });

    it('image data', () => {
      roomState.round = 1;
      roomState.setCurrDrawings();
      expect(roomState.roundData[0].id).toBe('b');
      expect(roomState.roundData[1].id).toBe('d');
      expect(roomState.roundData[0].data).toBe('{"lol":"iunno"}');
      expect(roomState.roundData[1].data).toBe('{"lol":"iunno"}');
    });

    it('prompt data', () => {
      roomState.round = 1;
      roomState.incrementRound();
      roomState.setCurrPrompts();
      expect(roomState.roundData[0].id).toBe('c');
      expect(roomState.roundData[1].id).toBe('b');
      expect(roomState.roundData[0].data).toBe('prompt1');
      expect(roomState.roundData[1].data).toBe('prompt1');
    });
  });
});
