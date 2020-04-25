import { shuffle } from 'lodash';

/*
Things to consider
//odd or even number of players 
//if odd number of players: 
*/
export enum Allocation {
  RAND = 0,
  ORDERED = 1,
}

type UnfilledChains = (string | undefined)[][];
type Chains = string[][];

const arr = (n: number) => [...Array(n)];

export const randomChain = (ids: string[]): Chains => {
  const len = ids.length;

  const fill = (array: UnfilledChains): boolean => {
    const len = array.length;
    for (let i = 0; i < len; i++) {
      for (let j = 0; j < len; j++) {
        if (!array[i][j]) {
          const allIds = new Set(ids);
          const row = array[i];
          const column = array.map((row) => row[j]);
          const picked = [...row, ...column];
          picked.forEach((id) => id && allIds.delete(id));

          const options = shuffle([...allIds]);
          for (const option of options) {
            array[i][j] = option;
            if (fill(array)) {
              return true;
            }
            array[i][j] = undefined;
          }
          return false;
        }
      }
    }

    return true;
  };

  const chains: UnfilledChains = arr(len).map(() =>
    arr(len).map(() => undefined)
  );

  for (let i = 0; i < len; i++) {
    chains[i][0] = ids[i];
  }

  if (fill(chains)) {
    return chains as Chains;
  } else {
    throw new Error('Failed to generate chain');
  }
};

export const orderedChain = (ids: string[]): Chains => {
  const chains: Chains = [];
  const n = ids.length;
  for (let i = 0; i < n; i++) {
    const chain = [];
    chain.push(ids[i]);
    for (let j = 1; j < n; j++) {
      chain.push(ids[(i + j) % n]);
    }
    chains.push(chain);
  }
  return chains;
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
