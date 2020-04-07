import { PhaseType } from '@full-circle/shared/lib/roomState/constants';
import React, { FunctionComponent, useState, useMemo } from 'react';
import { Redirect } from 'react-router-dom';
import { useRoom } from 'src/contexts/RoomContext';
import { useRoomLeave, useRoomMessage } from 'src/hooks/useRoomListeners';
import invariant from 'tiny-invariant';

import { DrawPage } from './draw/DrawPage';
import { GuessPage } from './guess/GuessPage';
import { Lobby } from './lobby/LobbyPage';

export const returnData = (input: any) => {
  return input;
};

const PlayerGamePage: FunctionComponent = () => {
  const { room, syncedState } = useRoom();

  const id = room?.sessionId;
  const roundData = syncedState?.roundData;

  const data = useMemo((): string => {
    if (id && roundData) {
      for (const link of roundData) {
        if (link.id === id) {
          return returnData(link.data);
        }
      }
    }
    return '';
  }, [id, roundData]);

  useRoomLeave(() => {
    alert('You have been disconnected');
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
