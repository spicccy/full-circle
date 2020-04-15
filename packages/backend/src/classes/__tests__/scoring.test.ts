import { addPlayers, mockRoom } from '../helpers/testHelper';
import RoomState from '../roomState';
import Player from '../subSchema/player';

describe('room scoring', () => {
  let roomState: RoomState;
  let playerIds: string[];

  beforeEach(() => {
    roomState = new RoomState(mockRoom, { predictableChains: true });
    addPlayers(roomState, 3);
    playerIds = [];
    for (const id in roomState.players) {
      playerIds.push(id);
    }
  });

  it('should initially return all zero-scores', () => {
    for (const id in roomState.players) {
      const player: Player = roomState.players[id];
      expect(player.score).toBe(0);
    }
  });

  it('should award a point to guesser and drawer when the guess matches the prompt', () => {
    roomState.advanceState();

    const chain1Links = roomState.currChains[0].links;
    const chain1Prompt1 = chain1Links[0].prompt.text;
    const chain1Drawer1 = chain1Links[0].image.playerId;
    const chain1Guesser1 = chain1Links[1].prompt.playerId;
    roomState.storeDrawing('0_id', []);
    roomState.storeDrawing('1_id', []);
    roomState.storeDrawing('2_id', []);
    roomState.advanceState();

    roomState.storeGuess(chain1Guesser1, chain1Prompt1);
    roomState.advanceState();

    expect(roomState.players[chain1Drawer1].score).toBe(1);
    expect(roomState.players[chain1Guesser1].score).toBe(1);
  });

  it('should not-award a point to players who do not match the previous prompt', () => {
    roomState.advanceState();

    const chain1Links = roomState.currChains[0].links;
    const chain1Guesser1 = chain1Links[1].prompt.playerId;
    roomState.storeDrawing('0_id', []);
    roomState.storeDrawing('1_id', []);
    roomState.storeDrawing('2_id', []);
    roomState.advanceState();

    roomState.storeGuess(chain1Guesser1, 'notavalidprompt');
    roomState.advanceState();

    expect(roomState.players[chain1Guesser1].score).toBe(0);
  });

  it('should award points to all guessers and the drawers when the guess matches the prompt', () => {
    roomState.advanceState();

    // use the fact that we are using predictable chains to know who is guessing who's drawings

    const chain1Links = roomState.currChains[0].links;
    const chain1Prompt = chain1Links[0].prompt.text;
    const chain2Links = roomState.currChains[1].links;
    const chain2Prompt = chain2Links[0].prompt.text;
    const chain3Links = roomState.currChains[2].links;
    const chain3Prompt = chain3Links[0].prompt.text;

    roomState.storeDrawing('0_id', []);
    roomState.storeDrawing('1_id', []);
    roomState.storeDrawing('2_id', []);
    roomState.advanceState();

    roomState.storeGuess('1_id', chain1Prompt);
    roomState.storeGuess('2_id', chain2Prompt);
    roomState.storeGuess(
      '0_id',
      chain3Prompt + 'this extra bit ensures this guess is wrong'
    );
    roomState.advanceState();

    // 0_id (draw) 1_id (guess correctly) 0_id: 1, 1_id: 1, 2_id: 0
    // 1_id (draw) 2_id (guess correctly) 0_id: 1, 1_id: 2, 2_id: 1
    // 2_id (draw) 0_id (guess wrong)     0_id: 1, 1_id: 2, 2_id: 1

    expect(roomState.players['1_id'].score).toBe(2);
    expect(roomState.players['2_id'].score).toBe(1);
    expect(roomState.players['0_id'].score).toBe(1);
  });
});
