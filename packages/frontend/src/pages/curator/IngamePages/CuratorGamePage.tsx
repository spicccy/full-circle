import { PhaseType } from '@full-circle/shared/lib/roomState/constants';
import React, { FunctionComponent, useState } from 'react';

import { IngameDraw } from './IngameDraw';
import { Lobby } from './Lobby';

const CuratorGamePage: FunctionComponent = () => {
  const [phase, setPhase] = useState(PhaseType.LOBBY);

  const startGame = () => {
    setPhase(PhaseType.DRAW);
  };

  if (phase === PhaseType.LOBBY) return <Lobby startGame={startGame} />;
  if (phase === PhaseType.DRAW) return <IngameDraw />;
  return <div></div>;
};

export { CuratorGamePage };
