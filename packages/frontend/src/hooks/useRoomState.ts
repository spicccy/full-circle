import { IRoomStateSynced } from '@full-circle/shared/lib/roomState/interfaces';
import { useEffect, useState } from 'react';
import { useRoom } from 'src/contexts/RoomContext';

export const useRoomState = (): IRoomStateSynced | undefined => {
  const { room } = useRoom();
  const [value, setValue] = useState<IRoomStateSynced>();

  useEffect(() => {
    setValue(room?.state?.toJSON());
    if (room) {
      const listener = room.onStateChange((newState) =>
        setValue(newState?.toJSON())
      );

      return () => listener.clear();
    }
  }, [room]);

  return value;
};
