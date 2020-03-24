export const objectValues = <T extends object>(obj: T) =>
  Object.values(obj) as T[keyof T][];

export const objectKeys = <T extends object>(obj: T) =>
  Object.keys(obj) as [keyof T];
