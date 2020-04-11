import { partialMock } from '@full-circle/shared/lib/testHelpers';
import { Room } from 'colyseus.js';

export const mocked = <T extends (...args: any[]) => any>(
  f: T
): jest.MockedFunction<T> => {
  if (!jest.isMockFunction(f)) {
    throw new Error(`Expected a mock, but found a real function.`);
  }
  return f;
};

export const mockRoom = partialMock<Room>({
  id: 'roomId',
  onStateChange: jest.fn().mockReturnValue({
    clear: jest.fn(),
  }) as any,
  onMessage: jest.fn().mockReturnValue({
    clear: jest.fn(),
  }) as any,
  onLeave: jest.fn().mockReturnValue({
    clear: jest.fn(),
  }) as any,
  leave: jest.fn(),
});
