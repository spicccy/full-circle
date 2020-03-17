import { useState, useEffect } from 'react';
import { useRoom } from 'src/contexts/RoomContext';
import { IRoomState } from '@full-circle/shared/lib/roomState/interfaces';

export const useRoomState = (): IRoomState | undefined => {
  const { room } = useRoom();
  const [value, setValue] = useState<IRoomState>();

  useEffect(() => {
    if (room) {
      const listener = room.onStateChange(newState =>
        setValue({ ...newState })
      );

      return () => listener.clear();
    }
  }, [room]);

  return value;
};
