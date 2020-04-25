import { ServerAction } from '@full-circle/shared/lib/actions';
import { notifyPlayerReady } from '@full-circle/shared/lib/actions/client';
import { PhaseType } from '@full-circle/shared/lib/roomState';
import { Box } from 'grommet';
import { FunctionComponent } from 'react';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import { useRoom } from 'src/contexts/RoomContext';
import { useConfirmLeave } from 'src/hooks/useConfirmLeave';
import { useRoomMessage } from 'src/hooks/useRoomListeners';

import { PlayerBackground } from './components/PlayerBackground';
import { EndPage } from './EndPage';
import { IngameDraw } from './IngameDraw';
import { IngameGuess } from './IngameGuess';
import { IngameReveal } from './IngameReveal';
import { Lobby } from './Lobby';
/* 
TODO:
The page constantly renders as the phasetimer
ticks down - use useMemo to fix this 
Lobby should only re-render when a new player has joined
*/

const CuratorGamePage: FunctionComponent = () => {
  const { room, syncedState } = useRoom();

  const { addToast } = useToasts();

  const curatorMessageHandler = (msg: ServerAction) => {
    switch (msg.type) {
      case '@server/warn':
        addToast(msg.payload, { appearance: 'warning' });
        break;
      default:
    }
  };

  const chain = syncedState?.chainManager?.revealedChain ?? null;

  useRoomMessage(curatorMessageHandler);

  useConfirmLeave();

  if (!room) {
    return <Redirect to="/create" />;
  }

  const startGame = () => room.send(notifyPlayerReady());

  const renderBody = () => {
    switch (syncedState?.phase.phaseType) {
      case PhaseType.LOBBY:
        return (
          <Box flex>
            <PlayerBackground />
            <Lobby startGame={startGame} />
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
        return <IngameReveal chain={chain} />;
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
