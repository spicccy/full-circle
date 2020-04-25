import { addPlayers, mockRoom } from '../helpers/testHelper';
import { PromptManager } from '../managers/promptManager/promptManager';
import RoomState from '../roomState';

describe('Room state', () => {
  describe('chain allocation ordered', () => {
    it('can generate chains correctly', () => {
      const roomState = new RoomState(mockRoom, {
        predictableRandomness: true,
      });
      addPlayers(roomState, 3);

      roomState.generateChains(
        new PromptManager({ testing: true }).getInitialPrompts(3)
      );
      const chains = roomState.chains;

      const chain1 = chains[0];
      expect(chain1.owner).toBe('0_id');
      expect(chain1.links[0].playerId).toBe('Initial Prompt');
      expect(chain1.links[1].playerId).toBe('0_id');
      expect(chain1.links[2].playerId).toBe('1_id');
      expect(chain1.links[3].playerId).toBe('2_id');

      const chain2 = chains[1];
      expect(chain2.owner).toBe('1_id');
      expect(chain2.links[0].playerId).toBe('Initial Prompt');
      expect(chain2.links[1].playerId).toBe('1_id');
      expect(chain2.links[2].playerId).toBe('2_id');
      expect(chain2.links[3].playerId).toBe('0_id');

      const chain3 = chains[2];
      expect(chain3.owner).toBe('2_id');
      expect(chain3.links[0].playerId).toBe('Initial Prompt');
      expect(chain3.links[1].playerId).toBe('2_id');
      expect(chain3.links[2].playerId).toBe('0_id');
      expect(chain3.links[3].playerId).toBe('1_id');
    });
  });
});
