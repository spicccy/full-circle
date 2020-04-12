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
import { useToasts } from 'react-toast-notifications';
import { useRoom } from 'src/contexts/RoomContext';
import { useRoomMessage } from 'src/hooks/useRoomListeners';
import { getType } from 'typesafe-actions';

import { CanvasCard } from './CanvasCard';
import { PenPicker } from './penPicker/PenPicker';
import { PromptCard } from './PromptCard';

interface IDrawPage {
  prompt: string;
}

const DrawPage: FunctionComponent<IDrawPage> = ({ prompt }) => {
  const { room } = useRoom();
  const [canvasActions, setCanvasActions] = useState<CanvasAction[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [pen, setPen] = useState<Pen>({
    type: PenType.SOLID,
    penColour: Colour.BLACK,
    penThickness: PenThickness.MEDIUM,
  });

  const { addToast } = useToasts();

  const handleSubmitDrawing = () => {
    setSubmitted(true);
    room?.send(submitDrawing(canvasActions));
    addToast('Submitted Drawing', { appearance: 'success' });
  };

  useRoomMessage((action) => {
    switch (action.type) {
      case getType(forceSubmit): {
        handleSubmitDrawing();
        return;
      }
    }
  });

  return (
    <Box
      background="dark-1"
      flex
      height={{ min: '100vh' }}
      align="center"
      justify="center"
      pad="medium"
    >
      <Box width="medium" margin={{ bottom: 'medium' }}>
        <PromptCard prompt={prompt} />
      </Box>
      <Box width="medium" margin={{ bottom: 'medium' }}>
        <CanvasCard
          submitted={submitted}
          canvasActions={canvasActions}
          setCanvasActions={setCanvasActions}
          pen={pen}
          onSubmitDrawing={handleSubmitDrawing}
        />
      </Box>
      <Box>
        <PenPicker pen={pen} setPen={setPen} />
      </Box>
    </Box>
  );
};

export { DrawPage };
