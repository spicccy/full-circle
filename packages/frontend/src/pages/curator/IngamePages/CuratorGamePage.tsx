import { notifyPlayerReady } from '@full-circle/shared/lib/actions/client';
import { PhaseType } from '@full-circle/shared/lib/roomState/constants';
import { FunctionComponent } from 'react';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { Player } from 'src/components/Player';
import { useRoom } from 'src/contexts/RoomContext';
import { objectValues } from '@full-circle/shared/lib/helpers';
import { useRoomState } from 'src/hooks/useRoomState';

import { IngameDraw } from './IngameDraw';
import { IngameGuess } from './IngameGuess';
import { Lobby } from './Lobby';
/* 
TODO:
The page constantly renders as the phasetimer
ticks down - use useMemo to fix this 
Lobby should only re-render when a new player has joined
*/
const arrayOfAngles: number[] = [10, 30, 170, 150, 190, 210, 330, 350];

const CuratorGamePage: FunctionComponent = () => {
  const roomState = useRoomState();
  const { room } = useRoom();
  const players = useRoomState()?.players;

  if (!room) {
    return <Redirect to="/home" />;
  }

  const startGame = () => room.send(notifyPlayerReady());

  const arrayOfPlayers = players ? objectValues(players) : [];

  const playerBoxes = arrayOfAngles.map((angle, index) => (
    <Player angle={angle} player={arrayOfPlayers[index]} key={index} />
  ));

  switch (roomState?.phase.phaseType) {
    case PhaseType.LOBBY:
      return <Lobby startGame={startGame} playerBoxes={playerBoxes} />;
    case PhaseType.DRAW:
      return <IngameDraw playerBoxes={playerBoxes} />;
    case PhaseType.GUESS:
      return <IngameGuess />;
    default:
      return <div>Loading...</div>;
  }
};

export { CuratorGamePage };
