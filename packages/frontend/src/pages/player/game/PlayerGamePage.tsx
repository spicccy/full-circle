import React, { FunctionComponent, useState } from 'react';
import { useRoom } from 'src/contexts/RoomContext';
import { Redirect } from 'react-router-dom';
import { DrawPage } from './draw/DrawPage';
import { PhaseType } from '@full-circle/shared/lib/roomState/constants';
import { GuessPage } from './guess/GuessPage';
import { useRoomMessage } from 'src/hooks/useRoomMessage';
import { getType } from 'typesafe-actions';
import { displayDrawing } from '@full-circle/shared/lib/actions/server';
import { CanvasAction } from '@full-circle/shared/lib/canvas/interfaces';

const PlayerGamePage: FunctionComponent = () => {
  const [currentPhase, setCurrentPhase] = useState<PhaseType>(PhaseType.DRAW);
  const [receivedDrawing, setReceivedDrawing] = useState<CanvasAction[]>();

  const { room } = useRoom();

  useRoomMessage(message => {
    switch (message.type) {
      case getType(displayDrawing): {
        setCurrentPhase(PhaseType.GUESS);
        setReceivedDrawing(message.payload);
      }
    }
  });

  if (!room) {
    return <Redirect to="/" />;
  }

  switch (currentPhase) {
    case PhaseType.DRAW: {
      return <DrawPage room={room} />;
    }

    case PhaseType.GUESS: {
      return (
        <GuessPage
          room={room}
          receivedDrawing={receivedDrawing}
          receivedArtist="Skithy"
        />
      );
    }

    default: {
      return null;
    }
  }
};

export { PlayerGamePage };
