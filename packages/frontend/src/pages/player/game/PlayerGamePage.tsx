import { PhaseType } from '@full-circle/shared/lib/roomState/constants';
import React, { FunctionComponent } from 'react';
import { Redirect } from 'react-router-dom';
import { useRoom } from 'src/contexts/RoomContext';
import { useRoomLeave } from 'src/hooks/useRoomListeners';

import { DrawPage } from './draw/DrawPage';
import { GuessPage } from './guess/GuessPage';
import { Lobby } from './lobby/LobbyPage';

const PlayerGamePage: FunctionComponent = () => {
  const { room, syncedState } = useRoom();

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
      return <DrawPage />;
    }

    case PhaseType.GUESS: {
      return <GuessPage />;
    }

    default: {
      return <div>Loading...</div>;
    }
  }
};

export { PlayerGamePage };
