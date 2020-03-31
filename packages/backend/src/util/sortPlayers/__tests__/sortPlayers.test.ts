import { checkFinished } from '../helpers';
import { Allocation, getAllocation } from '../sortPlayers';

describe('sortPlayers', () => {
  it('will generate a valid ordering', () => {
    const func = getAllocation(Allocation.RAND);
    const result = func(['a', 'b', 'c', 'd', 'e', 'f']);
    expect(result).toBeTruthy();
    if (result) {
      expect(checkFinished(result)).toBeTruthy();
    }
  });

  it('will generate a valid ordering', () => {
    const func = getAllocation(Allocation.RAND);
    const result = func(['a', 'b', 'c', 'd', 'e', 'f']);
    expect(result).toBeTruthy();
    if (result) {
      expect(checkFinished(result)).toBeTruthy();
    }
  });
});
