import { objectValues } from '@full-circle/shared/lib/helpers';
import { IPlayer } from '@full-circle/shared/lib/roomState';
import { useRoom } from 'src/contexts/RoomContext';

interface IUseRoomHelpers {
  playerData?: IPlayer;
  hasSubmitted: boolean;
  allSubmitted: boolean;
}

export const useRoomHelpers = (): IUseRoomHelpers => {
  const { room, syncedState } = useRoom();

  const id = room?.sessionId;
  const playerData = id ? syncedState?.players[id] : undefined;
  const hasSubmitted = Boolean(id && syncedState?.submittedPlayers[id]);
  const allSubmitted = Boolean(
    syncedState && objectValues(syncedState.submittedPlayers).every(Boolean)
  );

  return {
    playerData,
    hasSubmitted,
    allSubmitted,
  };
};
