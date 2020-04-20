import { ServerAction } from '@full-circle/shared/lib/actions';
import { becomeCurator, warn } from '@full-circle/shared/lib/actions/server';
import {
  LinkType,
  PhaseType,
  RoomErrorType,
} from '@full-circle/shared/lib/roomState';
import React, { FunctionComponent } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import { useRoom } from 'src/contexts/RoomContext';
import { useRoomHelpers } from 'src/hooks/useRoomHelpers';
import { getType } from 'typesafe-actions';

import { useRoomMessage } from '../../../hooks/useRoomListeners';
import { Background } from './components/Background';
import { DrawPage } from './draw/DrawPage';
import { GuessPage } from './guess/GuessPage';
import { Lobby } from './lobby/LobbyPage';
import { RevealPage } from './reveal/RevealPage';

const PlayerGamePage: FunctionComponent = () => {
  const { room, syncedState, roomCode } = useRoom();
  const { playerData } = useRoomHelpers();

  const { addToast } = useToasts();
  const history = useHistory();

  useRoomMessage((msg: ServerAction) => {
    switch (msg.type) {
      case getType(warn):
        switch (msg.payload) {
          case RoomErrorType.CURATOR_DISCONNECTED:
            addToast(
              `The curator has disconnected. Please rejoin room ${roomCode} with username 'curator' to establish a new curator`,
              {
                appearance: 'error',
              }
            );
            break;
          case RoomErrorType.CURATOR_DISCONNECTED_NO_REJOIN:
            addToast(RoomErrorType.CURATOR_DISCONNECTED_NO_REJOIN, {
              appearance: 'error',
            });
            break;
        }
        break;
      case getType(becomeCurator):
        history.push('/curator');
        break;
    }
  });

  const roundData = playerData?.roundData;

  if (!room) {
    return <Redirect to="/" />;
  }

  switch (syncedState?.phase.phaseType) {
    case PhaseType.LOBBY: {
      return <Lobby />;
    }

    case PhaseType.DRAW: {
      const prompt =
        roundData?.type === LinkType.PROMPT && roundData.data
          ? roundData.data
          : undefined;

      return <DrawPage prompt={prompt} />;
    }

    case PhaseType.GUESS: {
      const drawing =
        roundData?.type === LinkType.IMAGE && roundData.data
          ? JSON.parse(roundData.data)
          : undefined;

      return <GuessPage drawing={drawing} />;
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
