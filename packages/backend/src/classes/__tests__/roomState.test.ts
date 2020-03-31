import { PhaseType } from '@full-circle/shared/lib/roomState/constants';
import { mocked } from 'ts-jest/utils';

import { MyRoom } from '../../MyRoom';
import { addPlayers } from '../helpers/testHelper';
import RoomState from '../roomState';
import { getAllocation } from './../../util/sortPlayers/sortPlayers';

jest.mock('./../../util/sortPlayers/sortPlayers');

describe('Room state', () => {
  describe('transitions', () => {
    let state: RoomState;

    beforeEach(() => {
      state = new RoomState();
      addPlayers(state, 10);
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
      const room = new RoomState();
      const mockedVal = [
        ['a', 'b', 'c', 'd', 'e'],
        ['e', 'd', 'b', 'a', 'c'],
      ];
      mocked(getAllocation).mockReturnValue(() => {
        return mockedVal;
      });

      room.allocate();
      const chains = room.currChains;
      const chain1 = chains[0];
      expect(chain1.id).toBe('a');
      expect(chain1.links[0].image.id).toBe('a');
      expect(chain1.links[0].prompt.id).toBe('');
      expect(chain1.links[1].image.id).toBe('c');
      expect(chain1.links[1].prompt.id).toBe('b');
      expect(chain1.links[2].image.id).toBe('e');
      expect(chain1.links[2].prompt.id).toBe('d');

      const chain2 = chains[1];
      expect(chain2.id).toBe('e');
      expect(chain2.links[0].image.id).toBe('e');
      expect(chain2.links[0].prompt.id).toBe('');
      expect(chain2.links[1].image.id).toBe('b');
      expect(chain2.links[1].prompt.id).toBe('d');
      expect(chain2.links[2].image.id).toBe('c');
      expect(chain2.links[2].prompt.id).toBe('a');
    });
  });

  describe('it should automatically end the game loop', () => {
    let room: MyRoom;
    let roomState: RoomState;

    beforeEach(() => {
      room = new MyRoom();
      roomState = new RoomState(room);
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
});
