import { submitDrawing } from '@full-circle/shared/lib/actions/client';
import { CanvasAction } from '@full-circle/shared/lib/canvas/interfaces';
import { Room } from 'colyseus.js';
import { Box } from 'grommet';
import React, { FunctionComponent } from 'react';

import { CanvasCard } from './CanvasCard';
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
  const handleSubmitDrawing = (canvasActions: CanvasAction[]) => {
    room.send(submitDrawing(canvasActions));
  };

  return (
    <Box background="dark-1" fill align="center" justify="center" pad="medium">
      <Box width="medium" margin={{ bottom: 'medium' }}>
        <PromptCard prompt={prompt} promptBy={promptBy} />
      </Box>
      <Box width="medium">
        <CanvasCard onSubmitDrawing={handleSubmitDrawing} />
      </Box>
    </Box>
  );
};

export { DrawPage };
