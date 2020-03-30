import { notifyPlayerReady } from '@full-circle/shared/lib/actions/client';
import { PhaseType } from '@full-circle/shared/lib/roomState/constants';
import { FunctionComponent, useCallback } from 'react';
import React from 'react';
import { useRoom } from 'src/contexts/RoomContext';
import { useRoomState } from 'src/hooks/useRoomState';
import invariant from 'tiny-invariant';

import { IngameDraw } from './IngameDraw';
import { IngameGuess } from './IngameGuess';
import { Lobby } from './Lobby';
/* 
TODO:
The page constantly renders as the phasetimer
ticks down - use useMemo to fix this 
Lobby should only re-render when a new player has joined
*/
const CuratorGamePage: FunctionComponent = () => {
  const roomState = useRoomState();
  const { room } = useRoom();

  const startGame = useCallback(() => {
    invariant(room, 'No valid room found!');
    room.send(notifyPlayerReady());
  }, [room]);

  if (roomState?.phase.phaseType === PhaseType.LOBBY)
    return <Lobby startGame={startGame} />;
  if (roomState?.phase.phaseType === PhaseType.DRAW) return <IngameDraw />;
  if (roomState?.phase.phaseType === PhaseType.GUESS) return <IngameGuess />;
  return <div></div>;
};

export { CuratorGamePage };
