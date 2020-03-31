import RoomState from '../roomState';

export const addPlayers = (roomState: RoomState, nPlayers: number) => {
  for (let i = 0; i < nPlayers; i++) {
    roomState.addPlayer({
      id: `playerId${i}`,
      username: `playerUsername${i}`,
    });
  }
};
