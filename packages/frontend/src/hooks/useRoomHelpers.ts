import { objectValues } from '@full-circle/shared/lib/helpers';
import { useRoom } from 'src/contexts/RoomContext';

interface IUseRoomHelpers {
  hasSubmitted: boolean;
  allSubmitted: boolean;
}

export const useRoomHelpers = (): IUseRoomHelpers => {
  const { room, syncedState } = useRoom();

  const id = room?.sessionId;
  const hasSubmitted = Boolean(id && syncedState?.submittedPlayers[id]);
  const allSubmitted = Boolean(
    syncedState && objectValues(syncedState.submittedPlayers).every(Boolean)
  );

  return {
    hasSubmitted,
    allSubmitted,
  };
};
