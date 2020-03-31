import { IRoomStateSynced } from '@full-circle/shared/lib/roomState/interfaces';
import { useEffect, useState } from 'react';
import { useRoom } from 'src/contexts/RoomContext';

export const useRoomState = (): IRoomStateSynced | undefined => {
  const { room } = useRoom();
  const [value, setValue] = useState<IRoomStateSynced>();

  useEffect(() => {
    if (room) {
      const listener = room.onStateChange((newState) =>
        setValue({ ...newState })
      );

      return () => listener.clear();
    }
  }, [room]);

  return value;
};
