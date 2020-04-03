import {
  displayDrawing,
  displayPrompt,
} from '@full-circle/shared/lib/actions/server';
import { CanvasAction } from '@full-circle/shared/lib/canvas';
import { PhaseType } from '@full-circle/shared/lib/roomState/constants';
import React, { FunctionComponent, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useRoom } from 'src/contexts/RoomContext';
import { useRoomMessage } from 'src/hooks/useRoomMessage';
import { getType } from 'typesafe-actions';

import { DrawPage } from './draw/DrawPage';
import { GuessPage } from './guess/GuessPage';
import { Lobby } from './lobby/LobbyPage';

const PlayerGamePage: FunctionComponent = () => {
  const [receivedDrawing, setReceivedDrawing] = useState<CanvasAction[]>([]);
  const [prompt, setPrompt] = useState<string>('Guess1');

  const { room, syncedState } = useRoom();

  useRoomMessage((message) => {
    switch (message.type) {
      case getType(displayDrawing): {
        setReceivedDrawing(message.payload);
        return;
      }
      case getType(displayPrompt): {
        setPrompt(message.payload);
        return;
      }
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
      return <DrawPage prompt={prompt} promptBy="Skithy" />;
    }

    case PhaseType.GUESS: {
      return <GuessPage drawing={receivedDrawing} drawingBy="Skithy" />;
    }

    default: {
      return <div>Loading...</div>;
    }
  }
};

export { PlayerGamePage };
