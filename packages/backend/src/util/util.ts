export const shuffle = <T>(arr: T[]): T[] =>
  [...arr].sort(() => Math.random() - 0.5);

export const closeEnough = (a?: string, b?: string) =>
  a && b && a.toLowerCase().trim() === b.toLowerCase().trim();
