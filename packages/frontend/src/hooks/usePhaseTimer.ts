import { useEffect, useState } from 'react';
import { useRoom } from 'src/contexts/RoomContext';

const nearestSecond = (ms: number) => Math.round(ms / 1000);

/**
 * Custom hook that returns a timer countdown for the current phase
 */
export const usePhaseTimer = (): number | undefined => {
  const { syncedState } = useRoom();
  const [value, setValue] = useState<number>();

  const phaseEnd = syncedState?.phase.phaseEnd;

  useEffect(() => {
    if (phaseEnd) {
      const updateTimer = () => setValue(nearestSecond(phaseEnd - Date.now()));
      const ticker = setInterval(updateTimer, 500);
      return () => clearInterval(ticker);
    }
  }, [phaseEnd]);

  return value;
};
