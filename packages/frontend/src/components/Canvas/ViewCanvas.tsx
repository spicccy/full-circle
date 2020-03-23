import React, { FunctionComponent, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { redrawCanvas } from './helpers';
import { CanvasAction } from '@full-circle/shared/lib/canvas/interfaces';

import 'styled-components/macro';

const CanvasContainer = styled.div`
  touch-action: none;
  border: 2px solid red;

  > canvas {
    height: 100%;
    width: 100%;
  }
`;

interface IViewCanvasProps {
  height: number;
  width: number;
  canvasActions: CanvasAction[];
}

export const ViewCanvas: FunctionComponent<IViewCanvasProps> = ({
  height,
  width,
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
      <canvas height={height} width={width} ref={drawingCanvasRef} />
    </CanvasContainer>
  );
};
