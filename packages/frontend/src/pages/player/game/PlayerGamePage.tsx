import {
  displayDrawing,
  displayPrompt,
} from '@full-circle/shared/lib/actions/server';
import { CanvasAction } from '@full-circle/shared/lib/canvas';
import { PhaseType } from '@full-circle/shared/lib/roomState/constants';
import React, { FunctionComponent, useState, useMemo } from 'react';
import { Redirect } from 'react-router-dom';
import { useRoom } from 'src/contexts/RoomContext';
import { useRoomLeave, useRoomMessage } from 'src/hooks/useRoomListeners';
import { getType } from 'typesafe-actions';

import { DrawPage } from './draw/DrawPage';
import { GuessPage } from './guess/GuessPage';
import { Lobby } from './lobby/LobbyPage';

const PlayerGamePage: FunctionComponent = () => {
  const [receivedDrawing, setReceivedDrawing] = useState<CanvasAction[]>([]);
  const [prompt, setPrompt] = useState<string>('Guess1');

  const { room, syncedState } = useRoom();

  const id = room?.sessionId;
  const roundData = syncedState?.roundData;

  const data = useMemo((): string => {
    if (id && roundData) {
      for (const link of roundData) {
        if (link.id === id) {
          return link.data;
        }
      }
    }
    return '';
  }, [id, roundData]);

  useRoomLeave(() => {
    alert('You have been disconnected');
  });

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
      return <DrawPage prompt={data} promptBy="Skithy" />;
    }

    case PhaseType.GUESS: {
      return <GuessPage drawing={JSON.parse(data)} drawingBy="Skithy" />;
    }

    default: {
      return <div>Loading...</div>;
    }
  }
};

export { PlayerGamePage };
