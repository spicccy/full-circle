import {
  displayDrawing,
  displayPrompt,
} from '@full-circle/shared/lib/actions/server';
import { CanvasAction } from '@full-circle/shared/lib/canvas';
import { PhaseType } from '@full-circle/shared/lib/roomState/constants';
import React, { FunctionComponent, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useRoom } from 'src/contexts/RoomContext';
import { useRoomMessage } from 'src/hooks/useRoomListeners';
import { getType } from 'typesafe-actions';

import { Background } from './components/Background';
import { DrawPage } from './draw/DrawPage';
import { GuessPage } from './guess/GuessPage';
import { Lobby } from './lobby/LobbyPage';
import { RevealPage } from './reveal/RevealPage';

const PlayerGamePage: FunctionComponent = () => {
  const { room, syncedState } = useRoom();

  const [currentPrompt, setCurrentPrompt] = useState<string>('');
  const [currentDrawing, setCurrentDrawing] = useState<CanvasAction[]>([]);

  useRoomMessage((message) => {
    switch (message.type) {
      case getType(displayPrompt):
        setCurrentPrompt(message.payload);
        break;
      case getType(displayDrawing):
        setCurrentDrawing(JSON.parse(message.payload));
        break;
      default:
        console.warn('Unhandled message');
    }
  });

  if (!room) {
    return <Redirect to="/" />;
  }

  switch (syncedState?.phase.phaseType) {
    case PhaseType.LOBBY: {
      return <Lobby />;
    }

    case PhaseType.DRAW: {
      return <DrawPage prompt={currentPrompt} />;
    }

    case PhaseType.GUESS: {
      return <GuessPage drawing={currentDrawing} />;
    }

    case PhaseType.REVEAL: {
      return <RevealPage />;
    }

    default: {
      return <Background />;
    }
  }
};

export { PlayerGamePage };
