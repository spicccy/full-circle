import { ServerAction } from '@full-circle/shared/lib/actions';
import { notifyPlayerReady } from '@full-circle/shared/lib/actions/client';
import { PhaseType } from '@full-circle/shared/lib/roomState/constants';
import { Fragment, FunctionComponent, useState } from 'react';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import { useRoom } from 'src/contexts/RoomContext';

import { useRoomMessage } from '../../../hooks/useRoomListeners';
import { IngameDraw } from './IngameDraw';
import { IngameGuess } from './IngameGuess';
import { IngameReveal } from './IngameReveal';
import { Lobby } from './Lobby';
/* 
TODO:
The page constantly renders as the phasetimer
ticks down - use useMemo to fix this 
Lobby should only re-render when a new player has joined
*/

const CuratorGamePage: FunctionComponent = () => {
  const { room, syncedState } = useRoom();

  const { addToast } = useToasts();

  // TODO: ALEX expand this in upcoming PR
  const curatorMessageHandler = (msg: ServerAction) => {
    switch (msg.type) {
      case '@server/warn':
        addToast(msg.payload, { appearance: 'warning' });
        break;
      default:
    }
  };

  useRoomMessage(curatorMessageHandler);

  if (!room) {
    return <Redirect to="/create" />;
  }

  const startGame = () => room.send(notifyPlayerReady());

  const renderBody = () => {
    switch (syncedState?.phase.phaseType) {
      case PhaseType.LOBBY:
        return <Lobby startGame={startGame} />;
      case PhaseType.DRAW:
        return <IngameDraw />;
      case PhaseType.GUESS:
        return <IngameGuess />;
      case PhaseType.REVEAL:
        return <IngameReveal />;
      default:
        return <div>Loading</div>;
    }
  };

  return <Fragment>{renderBody()}</Fragment>;
};

export { CuratorGamePage };
