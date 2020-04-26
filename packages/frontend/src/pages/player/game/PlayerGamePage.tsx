import { serverError } from '@full-circle/shared/lib/actions/server';
import { PhaseType } from '@full-circle/shared/lib/roomState';
import React, { FunctionComponent } from 'react';
import { useToasts } from 'react-toast-notifications';
import { useRoom } from 'src/contexts/RoomContext';
import { useConfirmLeave } from 'src/hooks/useConfirmLeave';
import { useRoomHelpers } from 'src/hooks/useRoomHelpers';
import { useRoomMessage } from 'src/hooks/useRoomListeners';
import { getType } from 'typesafe-actions';

import { Background } from './components/Background';
import { DrawPage } from './draw/DrawPage';
import { GuessPage } from './guess/GuessPage';
import { JoinGamePage } from './join/JoinGamePage';
import { Lobby } from './lobby/LobbyPage';
import { RevealPage } from './reveal/RevealPage';

const PlayerGamePage: FunctionComponent = () => {
  const { syncedState } = useRoom();
  const { playerData } = useRoomHelpers();
  const { addToast } = useToasts();

  useConfirmLeave();

  useRoomMessage((msg) => {
    switch (msg.type) {
      case getType(serverError): {
        addToast(msg.payload, { appearance: 'error' });
      }
    }
  });

  if (!syncedState) {
    // Loading...
    return <Background />;
  }

  if (!playerData) {
    return <JoinGamePage />;
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

    case PhaseType.REVEAL: {
      return <RevealPage />;
    }

    default: {
      return <Background />;
    }
  }
};

export { PlayerGamePage };
