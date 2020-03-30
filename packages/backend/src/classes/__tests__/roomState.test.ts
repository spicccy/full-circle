import { PhaseType } from '@full-circle/shared/lib/roomState/constants';
import { mocked } from 'ts-jest/utils';

import RoomState from '../roomState';
import { getAllocation } from './../../util/sortPlayers/sortPlayers';

jest.mock('./../../util/sortPlayers/sortPlayers');

describe('Room state', () => {
  describe('transitions', () => {
    it('starts with the lobby state', () => {
      const state = new RoomState();
      expect(state.phase.phaseType).toBe(PhaseType.LOBBY);
    });

    it('transitions from lobby state to draw state', () => {
      const state = new RoomState();
      state.advanceState();
      expect(state.phase.phaseType).toBe(PhaseType.DRAW);
    });

    it('transitions from draw state to guess state', () => {
      const state = new RoomState();
      state.advanceState();
      state.advanceState();
      expect(state.phase.phaseType).toBe(PhaseType.GUESS);
    });

    it('transitions from guess state to draw state', () => {
      const state = new RoomState();
      state.advanceState();
      state.advanceState();
      state.advanceState();
      expect(state.phase.phaseType).toBe(PhaseType.DRAW);
    });

    it('should increment the round when a guess/draw cycle is over', () => {
      const state = new RoomState();
      expect(state.round).toBe(0);

      state.advanceState();
      expect(state.round).toBe(1);

      state.advanceState();
      expect(state.round).toBe(1);

      state.advanceState();
      expect(state.round).toBe(2);
    });

    test.todo('transitions from the final guess state to the reveal state');
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
});
