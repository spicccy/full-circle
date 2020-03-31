import { IRoomStateSynced } from '@full-circle/shared/lib/roomState/interfaces';
import { cloneDeep } from 'lodash';
import { useEffect, useState } from 'react';
import { useRoom } from 'src/contexts/RoomContext';

export const useRoomState = (): IRoomStateSynced | undefined => {
  const { room } = useRoom();
  const [value, setValue] = useState<IRoomStateSynced>();

  useEffect(() => {
    setValue(cloneDeep(room?.state));
    if (room) {
      const listener = room.onStateChange((newState) =>
        setValue(cloneDeep(newState))
      );

      return () => listener.clear();
    }
  }, [room]);

  return value;
};
