export const checkRows = (result: string[][]): boolean => {
  const column = result.length;
  const row = result[0].length;
  for (let i = 0; i < column; i++) {
    const seen: { [id: string]: boolean } = {};
    for (let j = 0; j < row; j++) {
      const curr = result[i][j];
      if (seen[curr] && curr) {
        return false;
      }
      seen[curr] = true;
    }
  }
  return true;
};

export const checkColumns = (result: string[][]): boolean => {
  const column = result.length;
  const row = result[0].length;
  for (let i = 0; i < row; i++) {
    const seen: { [id: string]: boolean } = {};
    for (let j = 0; j < column; j++) {
      const curr = result[j][i];
      if (seen[curr] && curr) {
        return false;
      }
      seen[curr] = true;
    }
  }
  return true;
};

export const checkChains = (result: string[][]): boolean => {
  return checkColumns(result) && checkRows(result);
};

export const checkFinished = (result: string[][]): boolean => {
  const row = result.length;
  const column = result[0].length;
  if (row !== column) {
    return false;
  }

  for (let i = 0; i < row; i++) {
    for (let j = 0; j < column; j++) {
      const curr = result[i][j];
      if (!curr) {
        return false;
      }
    }
  }

  return checkChains(result);
};
