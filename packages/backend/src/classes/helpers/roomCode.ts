export const generateRandomCode = (): string => {
  return Math.random().toString(10).substr(2, 4);
};

export const getNewCode = (usedCodes: string[]): string => {
  let newCode = generateRandomCode();
  while (usedCodes.find((code) => code === newCode)) {
    newCode = generateRandomCode();
  }
  return newCode;
};
