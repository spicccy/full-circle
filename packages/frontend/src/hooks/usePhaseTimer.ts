import { useState, useEffect, useCallback } from 'react';
import invariant from 'tiny-invariant';
import { useRoom } from 'src/contexts/RoomContext';
import { useRoomState } from './useRoomState';

export const MAX_PHASE_TIMER = 180;

/**
 * Custom hook that returns a timer countdown for the current phase
 */
export const usePhaseTimer = (): number => {
  const { room } = useRoom();
  const roomState = useRoomState();
  const [value, setValue] = useState<number>(MAX_PHASE_TIMER);

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
