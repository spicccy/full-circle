import { mocked } from 'ts-jest/utils';

import {
  getAllocation,
  orderedChain,
} from '../../util/sortPlayers/sortPlayers';
import { addPlayers, mockRoom } from '../helpers/testHelper';
import RoomState from '../roomState';

jest.mock('./../../util/sortPlayers/sortPlayers');
describe('Room state', () => {
  describe('chain allocation random', () => {
    it('can generate chains correctly', () => {
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

  describe('chain allocation ordered', () => {
    it('can generate chains correctly', () => {
      const roomState = new RoomState(mockRoom, { predictableChains: true });
      addPlayers(roomState, 3);

      // TODO: fix this as it should already be selected by the {predictableChains: true}
      // for some reason the mock from the previous test persists
      mocked(getAllocation).mockReturnValue(orderedChain);

      roomState.allocate();
      const chains = roomState.currChains;
      const chain1 = chains[0];
      expect(chain1.id).toBe('0_id');
      expect(chain1.links[0].prompt.playerId).toBe('');
      expect(chain1.links[0].image.playerId).toBe('0_id');
      expect(chain1.links[1].prompt.playerId).toBe('1_id');
      expect(chain1.links[1].image.playerId).toBe('2_id');

      const chain2 = chains[1];
      expect(chain2.id).toBe('1_id');
      expect(chain2.links[0].prompt.playerId).toBe('');
      expect(chain2.links[0].image.playerId).toBe('1_id');
      expect(chain2.links[1].prompt.playerId).toBe('2_id');
      expect(chain2.links[1].image.playerId).toBe('0_id');

      const chain3 = chains[2];
      expect(chain3.id).toBe('2_id');
      expect(chain3.links[0].prompt.playerId).toBe('');
      expect(chain3.links[0].image.playerId).toBe('2_id');
      expect(chain3.links[1].prompt.playerId).toBe('0_id');
      expect(chain3.links[1].image.playerId).toBe('1_id');
    });
  });
});
