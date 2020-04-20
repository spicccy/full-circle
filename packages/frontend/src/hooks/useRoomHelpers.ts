import { IPlayer } from '@full-circle/shared/lib/roomState';
import { useRoom } from 'src/contexts/RoomContext';

interface IUseRoomHelpers {
  playerData?: IPlayer;
  hasSubmitted: boolean;
  getUsername(playerId: string): string | undefined;
  isDisconnected: boolean;
}

export const useRoomHelpers = (): IUseRoomHelpers => {
  const { room, syncedState } = useRoom();

  const playerManager = syncedState?.playerManager;

  const id = room?.sessionId;
  const playerData = id
    ? syncedState?.playerManager?.playerMap?.[id]
    : undefined;

  const hasSubmitted = Boolean(playerData?.submitted);
  const isDisconnected = Boolean(playerData?.disconnected);

  const getUsername = (playerId: string) => {
    return playerManager?.playerMap?.[playerId]?.username;
  };

  return {
    playerData,
    hasSubmitted,
    getUsername,
    isDisconnected,
  };
};
