import { checkFinished } from '../helpers';
import { Allocation, getAllocation } from '../sortPlayers';

describe('sortPlayers', () => {
  it('ordered will generate a valid ordering', () => {
    const func = getAllocation(Allocation.ORDERED);
    const result = func(['a', 'b', 'c', 'd', 'e', 'f']);
    expect(checkFinished(result)).toBeTruthy();
  });

  it('rand will generate a valid ordering', () => {
    const func = getAllocation(Allocation.RAND);
    const result = func(['a', 'b', 'c', 'd', 'e', 'f']);
    expect(checkFinished(result)).toBeTruthy();
  });
});
