import { Room } from 'colyseus.js';

export const mocked = <T extends (...args: any[]) => any>(
  f: T
): jest.MockedFunction<T> => {
  if (!jest.isMockFunction(f)) {
    throw new Error(`Expected a mock, but found a real function.`);
  }
  return f;
};

export const partialMock = <R, T extends R = R>(mock: Partial<T>): R => {
  return mock as R;
};

export const mockRoom = partialMock<Room>({
  id: 'roomId',
  onStateChange: jest.fn().mockReturnValue({
    clear: jest.fn(),
  }) as any,
  onLeave: jest.fn().mockReturnValue({
    clear: jest.fn(),
  }) as any,
  leave: jest.fn(),
});
