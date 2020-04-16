import {
  checkChains,
  checkColumns,
  checkFinished,
  checkRows,
} from '../helpers';

describe('CheckRows', () => {
  it('if repeated val in row return false', () => {
    const testVals = [
      ['a', 'b', 'c', 'd'],
      ['a', 'b', 'c', 'a'],
    ];

    expect(checkRows(testVals)).toBe(false);
  });

  it('if no repeated val in row return true', () => {
    const testVals = [
      ['a', 'b', 'c', 'd'],
      ['a', 'b', 'c', 'd'],
    ];

    expect(checkRows(testVals)).toBe(true);
  });
});

describe('CheckColumns', () => {
  it('if repeated val in column return false', () => {
    const testVals = [
      ['a', 'b', 'c', 'd'],
      ['a', 'd', 'c', 'b'],
    ];

    expect(checkColumns(testVals)).toBe(false);
  });

  it('if no repeated val in column return true', () => {
    const testVals = [
      ['a', 'b', 'c', 'd'],
      ['d', 'c', 'b', 'a'],
    ];

    expect(checkColumns(testVals)).toBe(true);
  });
});

describe('CheckChains', () => {
  it('if repeated val in column or row return false', () => {
    const testVals = [
      ['a', 'b', 'c', 'a'],
      ['b', 'd', 'e', 'a'],
    ];

    expect(checkChains(testVals)).toBe(false);
  });

  it('if no repeated val in column return true', () => {
    const testVals = [
      ['a', 'b', 'c', 'd'],
      ['b', 'd', 'e', 'a'],
    ];

    expect(checkChains(testVals)).toBe(true);
  });

  it('if no repeated val in column return true', () => {
    const testVals = [
      ['', 'b', '', 'd'],
      ['', '', 'e', 'a'],
    ];

    expect(checkChains(testVals)).toBe(true);
  });
});

describe('CheckFinished', () => {
  it('if repeated val in column return false', () => {
    const testVals = [
      ['a', 'b', 'a'],
      ['b', 'c', 'a'],
      ['c', 'a', 'b'],
    ];

    expect(checkFinished(testVals)).toBe(false);
  });

  it('if no repeated val in column return true', () => {
    const testVals = [
      ['a', 'b', 'c'],
      ['b', 'c', 'a'],
      ['c', 'a', 'b'],
    ];

    expect(checkFinished(testVals)).toBe(true);
  });

  it('if undefined val in column or row return false', () => {
    const testVals = [
      ['a', 'b', 'c'],
      ['b', '', 'a'],
      ['c', 'a', 'b'],
    ];

    expect(checkFinished(testVals)).toBe(false);
  });

  it('if not square return false', () => {
    const testVals = [
      ['a', 'b', 'c'],
      ['b', 'c', 'a'],
    ];

    expect(checkFinished(testVals)).toBe(false);
  });
});
