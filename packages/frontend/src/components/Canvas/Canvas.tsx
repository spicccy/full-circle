import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  CanvasAction,
  drawStroke,
  ICoord,
  Pen,
} from '@full-circle/shared/lib/canvas';
import React, {
  FunctionComponent,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { useEventListener } from 'src/hooks/useEventListener';
import styled from 'styled-components';

import { getPointerPosition, handleHover, redrawCanvas } from './helpers';

const CanvasContainer = styled.div`
  position: relative;
  touch-action: none;

  > canvas {
    height: 100%;
    width: 100%;

    :not(:first-child) {
      position: absolute;
      top: 0;
      left: 0;
    }
  }
`;

interface ICanvasProps {
  pen: Pen;
  canvasActions: CanvasAction[];
  setCanvasActions: (canvasActions: CanvasAction[]) => void;
}

export const Canvas: FunctionComponent<ICanvasProps> = ({
  pen,
  canvasActions,
  setCanvasActions,
}) => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
  const hoverCanvasRef = useRef<HTMLCanvasElement>(null);

  const currentPath = useRef<ICoord[]>([]);

  const [isDrawing, setIsDrawing] = useState(false);

  useEventListener(canvasContainerRef, 'pointerdown', (e) => {
    const drawingCtx = drawingCanvasRef.current?.getContext('2d');
    if (!drawingCtx) return;

    currentPath.current.push(getPointerPosition(e, drawingCtx));

    redrawCanvas(drawingCtx, [
      ...canvasActions,
      drawStroke({ pen, points: currentPath.current }),
    ]);

    setIsDrawing(true);
  });

  useEventListener(document, 'pointermove', (e) => {
    if (isDrawing) {
      const drawingCtx = drawingCanvasRef.current?.getContext('2d');
      if (!drawingCtx) return;

      currentPath.current.push(getPointerPosition(e, drawingCtx));

      redrawCanvas(drawingCtx, [
        ...canvasActions,
        drawStroke({ pen, points: currentPath.current }),
      ]);
    }
  });

  useEventListener(document, 'pointerup', () => {
    if (isDrawing) {
      setIsDrawing(false);
      setCanvasActions([
        ...canvasActions,
        drawStroke({ pen, points: currentPath.current }),
      ]);
      currentPath.current = [];
    }
  });

  // cursor
  useEventListener(canvasContainerRef, 'pointermove', (e) => {
    const hoverCtx = hoverCanvasRef.current?.getContext('2d');
    if (!hoverCtx) return;

    handleHover(hoverCtx, pen, getPointerPosition(e, hoverCtx));
  });

  useEventListener(canvasContainerRef, 'pointerleave', () => {
    const hoverCtx = hoverCanvasRef.current?.getContext('2d');
    if (!hoverCtx) return;

    handleHover(hoverCtx, pen);
  });

  useLayoutEffect(() => {
    const drawingCtx = drawingCanvasRef.current?.getContext('2d');
    if (!drawingCtx) return;

    redrawCanvas(drawingCtx, canvasActions);
  }, [canvasActions]);

  return (
    <CanvasContainer ref={canvasContainerRef}>
      <canvas
        height={CANVAS_HEIGHT}
        width={CANVAS_WIDTH}
        ref={drawingCanvasRef}
        data-testid="drawCanvas"
      />
      <canvas
        height={CANVAS_HEIGHT}
        width={CANVAS_WIDTH}
        ref={hoverCanvasRef}
      />
    </CanvasContainer>
  );
};
