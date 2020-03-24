export const objectValues = <T extends object>(obj: T) =>
  Object.values(obj) as T[keyof T][];
