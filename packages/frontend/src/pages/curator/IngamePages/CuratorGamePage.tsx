import { PhaseType } from '@full-circle/shared/lib/roomState/constants';
import { Lobby } from './Lobby';
import { IngameDraw } from './IngameDraw';
import { IngameGuess } from './IngameGuess';
import { useState, FunctionComponent } from 'react';
import React from 'react';
/* 
TODO:
The page constantly renders as the phasetimer
ticks down - use useMemo to fix this 
Lobby should only re-render when a new player has joined
*/
const CuratorGamePage: FunctionComponent = () => {
  const [phase, setPhase] = useState(PhaseType.LOBBY);

  const startGame = () => {
    setPhase(PhaseType.DRAW);
  };

  if (phase === PhaseType.LOBBY) return <Lobby startGame={startGame} />;
  if (phase === PhaseType.DRAW) return <IngameDraw />;
  if (phase === PhaseType.GUESS) return <IngameGuess />;
  return <div></div>;
};

export { CuratorGamePage };
