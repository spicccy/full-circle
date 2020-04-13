import { checkChains, checkFinished, randomSplice } from './helpers';

/*
Things to consider
//odd or even number of players 
//if odd number of players: 
*/
export enum Allocation {
  RAND = 0,
  ORDERED = 1,
}

export const allocate = (
  result: string[][],
  r: number,
  c: number,
  possible: string[]
): string[][] | undefined => {
  const row = result.length;
  const randomPossible = randomSplice(possible);

  for (let i = 0; i < possible.length; i++) {
    const val = randomPossible[i];
    result[r][c] = val;

    if (checkFinished(result)) {
      return result;
    }

    if (checkChains(result)) {
      if (r >= row - 1) {
        const resultA = allocate(result, 0, c + 1, possible);
        if (resultA) {
          return resultA;
        }
      } else {
        const resultB = allocate(result, r + 1, c, possible);
        if (resultB) {
          return resultB;
        }
      }
    }
  }
  result[r][c] = '';
  return undefined;
};

const randomChain = (ids: string[]): string[][] | undefined => {
  const numIds = ids.length;
  const chainLength = Math.floor((numIds - 1) / 2) * 2;
  //initialise
  const result = [];
  for (let i = 0; i < numIds; i++) {
    result.push([...[ids[i]], ...Array(chainLength)]);
  }
  //allocate
  const allocatedChains = allocate(result, 0, 1, ids);
  return allocatedChains;
};

const orderedChain = (ids: string[]): string[][] => {
  console.log(ids);
  return [['']];
};

export const getAllocation = (type: Allocation) => {
  switch (type) {
    case Allocation.RAND:
      return randomChain;
    case Allocation.ORDERED:
    default:
      return orderedChain;
  }
};
