import { submitDrawing } from '@full-circle/shared/lib/actions/client';
import {
  CanvasAction,
  Colour,
  Pen,
  PenThickness,
  PenType,
} from '@full-circle/shared/lib/canvas';
import { Box, Heading } from 'grommet';
import React, { FunctionComponent, useState } from 'react';
import { Card } from 'src/components/Card/Card';
import { useRoom } from 'src/contexts/RoomContext';
import { useRoomHelpers } from 'src/hooks/useRoomHelpers';

import { Background } from '../components/Background';
import { CanvasCard } from './CanvasCard';
import { DrawingSubmittedCard } from './DrawingSubmittedCard';
import { PenPicker } from './penPicker/PenPicker';
import { PromptCard } from './PromptCard';

interface IDrawPage {
  prompt?: string;
}

const DrawPage: FunctionComponent<IDrawPage> = ({ prompt = '' }) => {
  const { room, syncedState } = useRoom();
  const { hasSubmitted } = useRoomHelpers();
  const [canvasActions, setCanvasActions] = useState<CanvasAction[]>([]);
  const [pen, setPen] = useState<Pen>({
    type: PenType.SOLID,
    penColour: Colour.BLACK,
    penThickness: PenThickness.MEDIUM,
  });

  const handleSubmitDrawing = () => {
    room?.send(submitDrawing(canvasActions));
  };

  const renderBody = () => {
    if (hasSubmitted) {
      return (
        <Box width="medium">
          <DrawingSubmittedCard canvasActions={canvasActions} />
        </Box>
      );
    }

    if (syncedState?.showBuffer) {
      return (
        <Box width="medium">
          <Card align="center" justify="center">
            <Heading>Moving on... Too bad</Heading>
          </Card>
        </Box>
      );
    }

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
