import { PhaseType } from '@full-circle/shared/lib/roomState/constants';
import {
  displayDrawing,
  displayPrompt,
} from '@full-circle/shared/lib/actions/server';
import { ServerAction } from '@full-circle/shared/lib/actions';
import React, { FunctionComponent, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import { useRoom } from 'src/contexts/RoomContext';
import {
  MessageHandler,
  useRoomLeave,
  useRoomMessage,
} from 'src/hooks/useRoomListeners';

import { DrawPage } from './draw/DrawPage';
import { GuessPage } from './guess/GuessPage';
import { Lobby } from './lobby/LobbyPage';
import { getType } from 'typesafe-actions';

const PlayerGamePage: FunctionComponent = () => {
  const { room, syncedState } = useRoom();

  const [currentPrompt, setCurrentPrompt] = useState<string>('');
  const [currentDrawing, setCurrentDrawing] = useState<string>('');

  const { addToast } = useToasts();

  useRoomLeave(() => {
    addToast('You have been disconnected', { appearance: 'error' });
  });

  const msgHandler: MessageHandler = (message: ServerAction) => {
    switch (message.type) {
      case getType(displayPrompt):
        setCurrentDrawing('');
        setCurrentPrompt(message.payload);
        break;
      case getType(displayDrawing):
        setCurrentPrompt('');
        setCurrentDrawing(message.payload);
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

    default: {
      return <div>Loading...</div>;
    }
  }
};

export { PlayerGamePage };
