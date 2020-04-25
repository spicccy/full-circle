import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  CanvasAction,
  drawStroke,
  ICoord,
  Pen,
} from '@full-circle/shared/lib/canvas';
import { objectValues } from '@full-circle/shared/lib/helpers';
import React, {
  FunctionComponent,
  ReactNode,
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
  display: flex;
  align-items: center;
  justify-content: center;

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

interface ITouch {
  path: ICoord[];
}

interface ICanvasProps {
  pen: Pen;
  canvasActions: CanvasAction[];
  placeholder?: ReactNode;
  setCanvasActions: (canvasActions: CanvasAction[]) => void;
}

export const Canvas: FunctionComponent<ICanvasProps> = ({
  pen,
  canvasActions,
  setCanvasActions,
  placeholder,
}) => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
  const hoverCanvasRef = useRef<HTMLCanvasElement>(null);

  const currentPath = useRef<ICoord[]>([]);
  const ongoingTouches = useRef<Record<number, ITouch>>({});

  const [isDrawing, setIsDrawing] = useState(false);

  const redrawDrawingCanvas = () => {
    const drawingCtx = drawingCanvasRef.current?.getContext('2d');
    if (drawingCtx) {
      const ongoingPaths = [
        currentPath.current,
        ...objectValues(ongoingTouches.current).map((touch) => touch.path),
      ];

      const allCanvasActions = [
        ...canvasActions,
        ...ongoingPaths.map((path) => drawStroke({ pen, points: path })),
      ];

      redrawCanvas(drawingCtx, allCanvasActions);
    }
  };

  const handleHoverCanvas = (pen: Pen, coord?: ICoord) => {
    const hoverCtx = hoverCanvasRef.current?.getContext('2d');
    if (hoverCtx) {
      handleHover(hoverCtx, pen, coord);
    }
  };

  useLayoutEffect(() => {
    redrawDrawingCanvas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasActions, pen]);

  // Mouse events
  useEventListener(canvasContainerRef, 'mousedown', (e) => {
    setIsDrawing(true);
    currentPath.current.push(getMousePosition(e, drawingCanvasRef.current));
    redrawDrawingCanvas();
  });

  useEventListener(document, 'mousemove', (e) => {
    if (isDrawing) {
      currentPath.current.push(getMousePosition(e, drawingCanvasRef.current));
      redrawDrawingCanvas();
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
    e.preventDefault();
    for (const touch of e.changedTouches) {
      ongoingTouches.current[touch.identifier] = {
        path: [getTouchPosition(touch, drawingCanvasRef.current)],
      };
    }

    redrawDrawingCanvas();
  });

  useEventListener(canvasContainerRef, 'touchmove', (e) => {
    e.preventDefault();
    for (const touch of e.changedTouches) {
      const ongoingTouch = ongoingTouches.current[touch.identifier];
      if (ongoingTouch) {
        ongoingTouch.path.push(
          getTouchPosition(touch, drawingCanvasRef.current)
        );
      }
    }

    redrawDrawingCanvas();
  });

  useEventListener(canvasContainerRef, 'touchend', (e) => {
    e.preventDefault();
    const strokes: CanvasAction[] = [];
    for (const touch of e.changedTouches) {
      const ongoingTouch = ongoingTouches.current[touch.identifier];
      if (ongoingTouch) {
        strokes.push(drawStroke({ pen, points: ongoingTouch.path }));
        delete ongoingTouches.current[touch.identifier];
      }
    }

    setCanvasActions([...canvasActions, ...strokes]);
  });

  const showPlaceholder = canvasActions.length === 0 && !isDrawing;

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
      {showPlaceholder && placeholder}
    </CanvasContainer>
  );
};
