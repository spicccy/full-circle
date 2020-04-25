import { RoomError } from '@full-circle/shared/lib/actions';

export const shuffle = <T>(arr: T[]): T[] =>
  [...arr].sort(() => Math.random() - 0.5);

export const closeEnough = (a?: string, b?: string) =>
  Boolean(a && b && a.toLowerCase().trim() === b.toLowerCase().trim());

export const throwJoinRoomError = (action: RoomError) => {
  throw new Error(JSON.stringify(action));
};
