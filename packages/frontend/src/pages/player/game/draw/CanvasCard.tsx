import 'styled-components/macro';

import {
  CanvasAction,
  clearCanvas,
  Colour,
  Pen,
} from '@full-circle/shared/lib/canvas';
import { Box, Heading } from 'grommet';
import React, { FunctionComponent } from 'react';
import { BaseButton } from 'src/components/BaseButton';
import { Canvas } from 'src/components/Canvas/Canvas';
import { Card } from 'src/components/Card/Card';
import { useEventListener } from 'src/hooks/useEventListener';
import { ReactComponent as Delete } from 'src/icons/delete.svg';
// import { ReactComponent as Redo } from 'src/icons/redo.svg';
import { ReactComponent as Undo } from 'src/icons/undo.svg';
import styled from 'styled-components/macro';

import { BorderBottom } from '../components/BorderBottom';
import { SubmitButton } from '../components/SubmitButton';

const ButtonWrapper = styled(BaseButton)`
  padding: 4px;
  transition: fill 0.2s;
  fill: ${Colour.DARK_GRAY};

  :disabled {
    fill: ${Colour.LIGHT_GRAY};
  }

  :focus {
    outline: 2px dashed black;
    z-index: 1;
  }
`;

const EraserWrapper = styled(ButtonWrapper)`
  margin-left: 4px;

  :hover:enabled {
    fill: ${Colour.RED};
  }
`;

interface ICanvasCardProps {
  pen: Pen;
  canvasActions: CanvasAction[];
  setCanvasActions(canvasActions: CanvasAction[]): void;
  onSubmitDrawing(): void;
  submitted: boolean;
}

// TODO: (Tony) implement redo
const CanvasCard: FunctionComponent<ICanvasCardProps> = ({
  pen,
  canvasActions,
  setCanvasActions,
  onSubmitDrawing,
  submitted,
}) => {
  const isEmpty = canvasActions.length === 0;

  const undo = () =>
    setCanvasActions(canvasActions.slice(0, canvasActions.length - 1));
  const clear = () => setCanvasActions([...canvasActions, clearCanvas()]);

  useEventListener(document, 'keydown', (e) => {
    if (e.ctrlKey) {
      switch (e.key) {
        case 'Enter':
          e.preventDefault();
          if (!isEmpty) {
            onSubmitDrawing();
          }
          break;
        case 'z':
          e.preventDefault();
          if (!isEmpty) {
            undo();
          }
          break;
        case 'd':
          e.preventDefault();
          if (!isEmpty) {
            clear();
          }
          break;
      }
    }
  });

  return (
    <Card css={{ pointerEvents: submitted ? 'none' : undefined }}>
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
        {isEmpty && (
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

      <Box direction="row" align="center" pad={{ left: '4px', right: '4px' }}>
        <ButtonWrapper title="undo (ctrl-z)" onClick={undo} disabled={isEmpty}>
          <Undo />
        </ButtonWrapper>
        {/* <ButtonWrapper title="redo (ctrl-y)">
          <Redo />
        </ButtonWrapper> */}
        <EraserWrapper
          title="clear (ctrl-d)"
          onClick={clear}
          disabled={isEmpty}
        >
          <Delete />
        </EraserWrapper>
        <SubmitButton
          title="submit (ctrl-enter)"
          disabled={isEmpty || submitted}
          onClick={onSubmitDrawing}
          label="Submit"
        />
      </Box>
    </Card>
  );
};

export { CanvasCard };
