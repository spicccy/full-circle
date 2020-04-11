import { submitDrawing } from '@full-circle/shared/lib/actions/client';
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

import { CanvasCard } from './CanvasCard';
import { PenPicker } from './penPicker/PenPicker';
import { PromptCard } from './PromptCard';

const DrawPage: FunctionComponent = () => {
  const { room, syncedState } = useRoom();
  const [canvasActions, setCanvasActions] = useState<CanvasAction[]>([]);
  const [pen, setPen] = useState<Pen>({
    type: PenType.SOLID,
    penColour: Colour.BLACK,
    penThickness: PenThickness.MEDIUM,
  });

  const id = room?.sessionId;
  const roundData = syncedState?.roundData;
  const prompt = roundData?.find((link) => link.id === id)?.data ?? '';

  const handleSubmitDrawing = () => {
    room?.send(submitDrawing(canvasActions));
  };

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
