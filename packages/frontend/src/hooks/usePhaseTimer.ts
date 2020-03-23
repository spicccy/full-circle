import { useState, useEffect, useCallback } from 'react';
import invariant from 'tiny-invariant';
import { useRoom } from 'src/contexts/RoomContext';
import { useRoomState } from './useRoomState';

/**
 * Custom hook that returns a timer countdown for the current phase
 */
export const usePhaseTimer = (): number | undefined => {
  const { room } = useRoom();
  const roomState = useRoomState();
  const [value, setValue] = useState<number | undefined>(undefined);

  const updateTimer = useCallback(() => {
    invariant(roomState, 'Room State not initialised');
    const timerLength = roomState.phase.phaseEnd - Date.now();
    setValue(timerLength);
  }, [setValue, roomState]);

  useEffect(() => {
    if (!room) {
      setValue(() => {
        throw new Error('Room State not initialised');
      });
    }

    const ticker = setInterval(updateTimer, 500);
    return () => clearInterval(ticker);
  }, [room, roomState, updateTimer]);

  return value;
};
