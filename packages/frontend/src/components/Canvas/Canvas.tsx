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
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { useEventListener } from 'src/hooks/useEventListener';
import styled from 'styled-components';

import {
  getMousePosition,
  getTouchPosition,
  handleHover,
  redrawCanvas,
} from './helpers';

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

  const drawingCtx = drawingCanvasRef.current?.getContext('2d');
  const hoverCtx = hoverCanvasRef.current?.getContext('2d');

  const currentPath = useRef<ICoord[]>([]);

  const [isDrawing, setIsDrawing] = useState(false);

  const redrawDrawingCanvas = useCallback(
    (canvasActions: CanvasAction[]) => {
      if (drawingCtx) {
        redrawCanvas(drawingCtx, canvasActions);
      }
    },
    [drawingCtx]
  );

  const handleHoverCanvas = useCallback(
    (pen: Pen, coord?: ICoord) => {
      if (hoverCtx) {
        handleHover(hoverCtx, pen, coord);
      }
    },
    [hoverCtx]
  );

  useLayoutEffect(() => {
    redrawDrawingCanvas(canvasActions);
  }, [canvasActions, redrawDrawingCanvas]);

  // Mouse events
  useEventListener(canvasContainerRef, 'mousedown', (e) => {
    setIsDrawing(true);
    currentPath.current.push(getMousePosition(e, drawingCanvasRef.current));
    redrawDrawingCanvas([
      ...canvasActions,
      drawStroke({ pen, points: currentPath.current }),
    ]);
  });

  useEventListener(document, 'mousemove', (e) => {
    if (isDrawing) {
      currentPath.current.push(getMousePosition(e, drawingCanvasRef.current));
      redrawDrawingCanvas([
        ...canvasActions,
        drawStroke({ pen, points: currentPath.current }),
      ]);
    }
  });

  useEventListener(document, 'mouseup', () => {
    if (isDrawing) {
      setIsDrawing(false);
      setCanvasActions([
        ...canvasActions,
        drawStroke({ pen, points: currentPath.current }),
      ]);
      currentPath.current = [];
    }
  });

  // Mouse cursor
  useEventListener(canvasContainerRef, 'mousemove', (e) => {
    handleHoverCanvas(pen, getMousePosition(e, hoverCanvasRef.current));
  });

  useEventListener(canvasContainerRef, 'mouseleave', () => {
    handleHoverCanvas(pen);
  });

  // Touch events
  useEventListener(canvasContainerRef, 'touchstart', (e) => {
    setIsDrawing(true);
    currentPath.current.push(getTouchPosition(e, drawingCanvasRef.current));
    redrawDrawingCanvas([
      ...canvasActions,
      drawStroke({ pen, points: currentPath.current }),
    ]);
  });

  useEventListener(document, 'touchmove', (e) => {
    if (isDrawing) {
      currentPath.current.push(getTouchPosition(e, drawingCanvasRef.current));
      redrawDrawingCanvas([
        ...canvasActions,
        drawStroke({ pen, points: currentPath.current }),
      ]);
    }
  });

  useEventListener(document, 'touchend', () => {
    if (isDrawing) {
      setIsDrawing(false);
      setCanvasActions([
        ...canvasActions,
        drawStroke({ pen, points: currentPath.current }),
      ]);
      currentPath.current = [];
    }
  });

  return (
    <CanvasContainer ref={canvasContainerRef}>
      <canvas
        height={CANVAS_HEIGHT}
        width={CANVAS_WIDTH}
        ref={drawingCanvasRef}
      />
      <canvas
        height={CANVAS_HEIGHT}
        width={CANVAS_WIDTH}
        ref={hoverCanvasRef}
      />
    </CanvasContainer>
  );
};
