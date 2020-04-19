import { objectValues } from '@full-circle/shared/lib/helpers';
import { IPlayer } from '@full-circle/shared/lib/roomState';
import { useRoom } from 'src/contexts/RoomContext';

interface IUseRoomHelpers {
  playerData?: IPlayer;
  hasSubmitted: boolean;
  allSubmitted: boolean;
  getUsername(playerId: string): string | undefined;
  isDisconnected: boolean;
}

export const useRoomHelpers = (): IUseRoomHelpers => {
  const { room, syncedState } = useRoom();

  const playerManager = syncedState?.playerManager;
  const submittedPlayers = playerManager?.submittedPlayers;

  const id = room?.sessionId;
  const playerData = id
    ? syncedState?.playerManager?.playerMap?.[id]
    : undefined;
  const hasSubmitted = Boolean(id && submittedPlayers?.[id]);
  const allSubmitted = Boolean(
    submittedPlayers && objectValues(submittedPlayers).every(Boolean)
  );
  const getUsername = (playerId: string) => {
    return playerManager?.playerMap?.[playerId]?.username;
  };

  const isDisconnected = Boolean(
    id && playerManager?.playerMap?.[id]?.disconnected
  );

  return {
    playerData,
    hasSubmitted,
    allSubmitted,
    getUsername,
    isDisconnected,
  };
};
