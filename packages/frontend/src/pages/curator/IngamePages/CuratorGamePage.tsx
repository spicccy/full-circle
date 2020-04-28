import { serverError } from '@full-circle/shared/lib/actions/server';
import { PhaseType } from '@full-circle/shared/lib/roomState';
import { Box } from 'grommet';
import { FunctionComponent } from 'react';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import { useRoom } from 'src/contexts/RoomContext';
import { useConfirmLeave } from 'src/hooks/useConfirmLeave';
import { useRoomMessage } from 'src/hooks/useRoomListeners';
import { getType } from 'typesafe-actions';

import { PlayerBackground } from './components/PlayerBackground';
import { EndPage } from './EndPage';
import { IngameDraw } from './IngameDraw';
import { IngameGuess } from './IngameGuess';
import { IngameReveal } from './IngameReveal';
import { Lobby } from './Lobby';

const CuratorGamePage: FunctionComponent = () => {
  const { room, syncedState } = useRoom();

  const { addToast } = useToasts();

  useRoomMessage((msg) => {
    switch (msg.type) {
      case getType(serverError): {
        addToast(msg.payload, { appearance: 'warning' });
        break;
      }
    }
  });

  useConfirmLeave();

  if (!room) {
    return <Redirect to="/create" />;
  }

  const renderBody = () => {
    switch (syncedState?.phase.phaseType) {
      case PhaseType.LOBBY:
        return (
          <Box flex>
            <PlayerBackground />
            <Lobby />
          </Box>
        );
      case PhaseType.DRAW:
        return (
          <Box flex>
            <PlayerBackground />
            <IngameDraw />
          </Box>
        );
      case PhaseType.GUESS:
        return (
          <Box flex>
            <PlayerBackground />
            <IngameGuess />
          </Box>
        );
      case PhaseType.REVEAL:
        return <IngameReveal />;
      case PhaseType.END:
        return (
          <Box flex background="light-2">
            <EndPage />
          </Box>
        );
      default:
        return <div>Loading</div>;
    }
  };

  return renderBody();
};

export { CuratorGamePage };
