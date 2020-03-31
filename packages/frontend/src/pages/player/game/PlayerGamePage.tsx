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
  const [currentPhase, setCurrentPhase] = useState<PhaseType>(PhaseType.DRAW);
  const [receivedDrawing, setReceivedDrawing] = useState<CanvasAction[]>([]);
  const [prompt, setPrompt] = useState<string>('Guess1');

  const { room } = useRoom();

  useRoomMessage((message) => {
    switch (message.type) {
      case getType(displayDrawing): {
        setCurrentPhase(PhaseType.GUESS);
        setReceivedDrawing(message.payload);
        return;
      }
      case getType(displayPrompt): {
        setCurrentPhase(PhaseType.DRAW);
        setPrompt(message.payload);
        return;
      }
    }
  });

  if (!room) {
    return <Redirect to="/" />;
  }

  switch (currentPhase) {
    case PhaseType.LOBBY: {
      return <Lobby />;
    }

    case PhaseType.DRAW: {
      return <DrawPage room={room} prompt={prompt} promptBy="Skithy" />;
    }

    case PhaseType.GUESS: {
      return (
        <GuessPage room={room} drawing={receivedDrawing} drawingBy="Skithy" />
      );
    }

    default: {
      return null;
    }
  }
};

export { PlayerGamePage };
