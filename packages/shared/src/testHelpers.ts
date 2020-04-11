export const partialMock = <R, T extends R = R>(mock: Partial<T>): R => {
  return mock as R;
};
