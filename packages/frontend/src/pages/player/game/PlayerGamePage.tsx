import {
  displayDrawing,
  displayPrompt,
} from '@full-circle/shared/lib/actions/server';
import { CanvasAction } from '@full-circle/shared/lib/canvas';
import { PhaseType } from '@full-circle/shared/lib/roomState/constants';
import React, { FunctionComponent, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import { useRoom } from 'src/contexts/RoomContext';
import {
  MessageHandler,
  useRoomLeave,
  useRoomMessage,
} from 'src/hooks/useRoomListeners';
import { getType } from 'typesafe-actions';

import { DrawPage } from './draw/DrawPage';
import { GuessPage } from './guess/GuessPage';
import { Lobby } from './lobby/LobbyPage';
import { getType } from 'typesafe-actions';
import RevealPage from './reveal/RevealPage';

const PlayerGamePage: FunctionComponent = () => {
  const { room, syncedState } = useRoom();

  const [currentPrompt, setCurrentPrompt] = useState<string>('');
  const [currentDrawing, setCurrentDrawing] = useState<CanvasAction[]>([]);

  const { addToast } = useToasts();

  useRoomLeave(() => {
    addToast('You have been disconnected', { appearance: 'error' });
  });

  const msgHandler: MessageHandler = (message) => {
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
  };

  useRoomMessage(msgHandler);

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

    case PhaseType.REVEAL: {
      return <RevealPage />;
    }

    default: {
      return <div>Loading...</div>;
    }
  }
};

export { PlayerGamePage };
