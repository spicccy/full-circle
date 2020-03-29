import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  CanvasAction,
} from '@full-circle/shared/lib/canvas';
import React, { FunctionComponent, useEffect, useRef } from 'react';
import styled from 'styled-components';

import { redrawCanvas } from './helpers';

const CanvasContainer = styled.div`
  touch-action: none;

  > canvas {
    height: 100%;
    width: 100%;
  }
`;

interface IViewCanvasProps {
  canvasActions: CanvasAction[];
}

export const ViewCanvas: FunctionComponent<IViewCanvasProps> = ({
  canvasActions,
}) => {
  const drawingCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const drawingCtx = drawingCanvasRef.current?.getContext('2d');
    if (!drawingCtx) return;

    redrawCanvas(drawingCtx, canvasActions);
  }, [drawingCanvasRef, canvasActions]);

  return (
    <CanvasContainer>
      <canvas
        height={CANVAS_HEIGHT}
        width={CANVAS_WIDTH}
        ref={drawingCanvasRef}
      />
    </CanvasContainer>
  );
};
