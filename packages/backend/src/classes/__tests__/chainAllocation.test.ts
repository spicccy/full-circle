import { addPlayers, mockRoom } from '../helpers/testHelper';
import RoomState from '../roomState';

describe('Room state', () => {
  describe('chain allocation ordered', () => {
    it('can generate chains correctly', () => {
      const roomState = new RoomState(mockRoom, { predictableChains: true });
      addPlayers(roomState, 3);

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
