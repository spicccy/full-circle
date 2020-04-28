import { useCallback, useState } from 'react';

export const useLoader = () => {
  const [isLoading, setIsLoading] = useState(false);
  const load = useCallback(async <T>(fn: () => T): Promise<T> => {
    setIsLoading(true);
    const result = await fn();
    setIsLoading(false);
    return result;
  }, []);

  return {
    isLoading,
    load,
  };
};
