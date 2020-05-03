import { submitDrawing } from '@full-circle/shared/lib/actions/client';
import { forceSubmit } from '@full-circle/shared/lib/actions/server';
import {
  CanvasAction,
  Colour,
  Pen,
  PenThickness,
  PenType,
} from '@full-circle/shared/lib/canvas';
import { Box } from 'grommet';
import React, { FunctionComponent, useState } from 'react';
import { useRoom } from 'src/contexts/RoomContext';
import { useRoomHelpers } from 'src/hooks/useRoomHelpers';
import { useRoomMessage } from 'src/hooks/useRoomListeners';
import { getType } from 'typesafe-actions';

import { Background } from '../components/Background';
import { CanvasCard } from './CanvasCard';
import { DrawingSubmittedCard } from './DrawingSubmittedCard';
import { PenPicker } from './penPicker/PenPicker';
import { PromptCard } from './PromptCard';

const DrawPage: FunctionComponent = () => {
  const { sendAction, syncedState } = useRoom();
  const { hasSubmitted, playerData } = useRoomHelpers();
  const [canvasActions, setCanvasActions] = useState<CanvasAction[]>([]);
  const [pen, setPen] = useState<Pen>({
    type: PenType.SOLID,
    penColour: Colour.BLACK,
    penThickness: PenThickness.MEDIUM,
  });

  const handleSubmitDrawing = () => {
    if (!hasSubmitted) {
      sendAction(submitDrawing(canvasActions));
    }
  };

  useRoomMessage((action) => {
    switch (action.type) {
      case getType(forceSubmit): {
        handleSubmitDrawing();
      }
    }
  });

  const renderBody = () => {
    if (hasSubmitted || syncedState?.showBuffer) {
      return (
        <Box width="medium">
          <DrawingSubmittedCard canvasActions={canvasActions} />
        </Box>
      );
    }

    const prompt = playerData?.roundData?.data ?? undefined;

    return (
      <>
        <Box width="medium" margin={{ bottom: 'medium' }}>
          <PromptCard prompt={prompt} />
        </Box>
        <Box width="medium" margin={{ bottom: 'medium' }}>
          <CanvasCard
            canvasActions={canvasActions}
            setCanvasActions={setCanvasActions}
            pen={pen}
            onSubmitDrawing={handleSubmitDrawing}
          />
        </Box>
        <Box>
          <PenPicker pen={pen} setPen={setPen} />
        </Box>
      </>
    );
  };

  return <Background>{renderBody()}</Background>;
};

export { DrawPage };
