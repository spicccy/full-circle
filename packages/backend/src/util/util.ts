export const closeEnough = (a?: string, b?: string) =>
  Boolean(a && b && a.toLowerCase().trim() === b.toLowerCase().trim());
