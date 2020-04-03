import { submitDrawing } from '@full-circle/shared/lib/actions/client';
import {
  CanvasAction,
  Colour,
  Pen,
  PenThickness,
  PenType,
} from '@full-circle/shared/lib/canvas';
import { Room } from 'colyseus.js';
import { Box } from 'grommet';
import React, { FunctionComponent, useState } from 'react';

import { CanvasCard } from './CanvasCard';
import { PenPicker } from './penPicker/PenPicker';
import { PromptCard } from './PromptCard';

interface IDrawPageProps {
  room: Room;
  prompt: string;
  promptBy: string;
}

const DrawPage: FunctionComponent<IDrawPageProps> = ({
  room,
  prompt,
  promptBy,
}) => {
  const [canvasActions, setCanvasActions] = useState<CanvasAction[]>([]);
  const [pen, setPen] = useState<Pen>({
    type: PenType.SOLID,
    penColour: Colour.BLACK,
    penThickness: PenThickness.MEDIUM,
  });

  const handleSubmitDrawing = () => {
    room.send(submitDrawing(canvasActions));
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
        <PromptCard prompt={prompt} promptBy={promptBy} />
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
