import { ServerAction } from '@full-circle/shared/lib/actions';
import { notifyPlayerReady } from '@full-circle/shared/lib/actions/client';
import { PhaseType } from '@full-circle/shared/lib/roomState/constants';
import {
  Fragment,
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import React from 'react';
import { Redirect } from 'react-router-dom';
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

  const messages = useRoomMessage();

  const [popup, _setPopup] = useState<React.ReactNode>(null);

  // TODO: ALEX expand this in upcoming PR
  const curatorMessageHandler = useCallback((msg: ServerAction) => {
    switch (msg.type) {
      case '@server/warn':
        // TODO: find a nice popup or toast library
        // setPopup(<div>{msg.payload.message}</div>);
        alert(msg.payload);
        break;
      default:
    }
  }, []);

  useEffect(() => {
    const nMsgs = messages.length;
    if (nMsgs > 0) {
      curatorMessageHandler(messages[nMsgs - 1]);
    }
  }, [curatorMessageHandler, messages]);

  if (!room) {
    return <Redirect to="/create" />;
  }

  const startGame = () => room.send(notifyPlayerReady());

  let MainPage = null;
  switch (syncedState?.phase.phaseType) {
    case PhaseType.LOBBY:
      MainPage = <Lobby startGame={startGame} />;
      break;
    case PhaseType.DRAW:
      MainPage = <IngameDraw />;
      break;
    case PhaseType.GUESS:
      MainPage = <IngameGuess />;
      break;
    case PhaseType.REVEAL:
      MainPage = <IngameReveal />;
      break;
    default:
      MainPage = <div>Loading...</div>;
  }

  return (
    <Fragment>
      {popup}
      {MainPage}
    </Fragment>
  );
};

export { CuratorGamePage };
