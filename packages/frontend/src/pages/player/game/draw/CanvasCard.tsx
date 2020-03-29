import 'styled-components/macro';

import { CanvasAction, Pen } from '@full-circle/shared/lib/canvas';
import { Box, Heading } from 'grommet';
import React, { FunctionComponent } from 'react';
import { Canvas } from 'src/components/Canvas/Canvas';
import { Card } from 'src/components/Card/Card';

import { BorderBottom } from '../components/BorderBottom';
import { SubmitButton } from '../components/SubmitButton';

interface ICanvasCardProps {
  pen: Pen;
  canvasActions: CanvasAction[];
  setCanvasActions(canvasActions: CanvasAction[]): void;
  onSubmitDrawing(): void;
}

const CanvasCard: FunctionComponent<ICanvasCardProps> = ({
  pen,
  canvasActions,
  setCanvasActions,
  onSubmitDrawing,
}) => {
  return (
    <Card>
      <BorderBottom
        css={{ position: 'relative' }}
        align="center"
        justify="center"
      >
        <Canvas
          pen={pen}
          canvasActions={canvasActions}
          setCanvasActions={setCanvasActions}
        />
        {canvasActions.length === 0 && (
          <Heading
            level="2"
            css={{
              position: 'absolute',
              opacity: 0.2,
              pointerEvents: 'none',
            }}
          >
            Draw here
          </Heading>
        )}
      </BorderBottom>

      <Box>
        <SubmitButton
          disabled={!canvasActions.length}
          onClick={onSubmitDrawing}
          label="Submit"
        />
      </Box>
    </Card>
  );
};

export { CanvasCard };
