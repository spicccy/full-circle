import { LinkType, PhaseType } from '@full-circle/shared/lib/roomState';
import React, { FunctionComponent } from 'react';
import { Redirect } from 'react-router-dom';
import { useRoom } from 'src/contexts/RoomContext';
import { useRoomHelpers } from 'src/hooks/useRoomHelpers';

import { Background } from './components/Background';
import { DrawPage } from './draw/DrawPage';
import { GuessPage } from './guess/GuessPage';
import { Lobby } from './lobby/LobbyPage';
import { RevealPage } from './reveal/RevealPage';

const PlayerGamePage: FunctionComponent = () => {
  const { room, syncedState } = useRoom();
  const { playerData } = useRoomHelpers();

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
        roundData?.type === LinkType.PROMPT ? roundData.data : undefined;

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
