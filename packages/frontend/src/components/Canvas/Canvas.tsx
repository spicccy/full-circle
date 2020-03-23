import React, {
  FunctionComponent,
  useState,
  useRef,
  useLayoutEffect,
} from 'react';
import { useEventListener } from 'src/hooks/useEventListener';
import styled from 'styled-components';
import {
  ICoord,
  CanvasAction,
  IPen,
} from '@full-circle/shared/lib/canvas/interfaces';
import {
  BrushType,
  Colour,
  PenThickness,
} from '@full-circle/shared/lib/canvas/constants';
import {
  getPointerPosition,
  redrawCanvas,
  setupPen,
  clearCanvas,
  drawStroke,
} from './helpers';
import { BrushTypePicker } from './BrushTypePicker';
import { ColourPicker } from './ColourPicker';
import { ThicknessPicker } from './ThicknessPicker';

import 'styled-components/macro';

const CanvasContainer = styled.div`
  position: relative;
  touch-action: none;
  border: 2px solid red;

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
  height: number;
  width: number;
  canvasActions: CanvasAction[];
  setCanvasActions: (canvasActions: CanvasAction[]) => void;
}

export const Canvas: FunctionComponent<ICanvasProps> = ({
  height,
  width,
  canvasActions,
  setCanvasActions,
}) => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
  const hoverCanvasRef = useRef<HTMLCanvasElement>(null);

  const currentPath = useRef<ICoord[]>([]);

  const [isDrawing, setIsDrawing] = useState(false);
  const [brushType, setBrushType] = useState<BrushType>(BrushType.SOLID);
  const [penColour, setPenColour] = useState<Colour>(Colour.NAVY);
  const [penThickness, setPenThickness] = useState<PenThickness>(
    PenThickness.MEDIUM
  );

  const pen: IPen = {
    brushType,
    penColour,
    penThickness,
  };

  useEventListener(canvasContainerRef, 'pointerdown', e => {
    const drawingCtx = drawingCanvasRef.current?.getContext('2d');
    if (!drawingCtx) return;

    // currentPath.current.push({ x: 10, y: 10 });
    currentPath.current.push(getPointerPosition(e, drawingCtx));

    redrawCanvas(drawingCtx, [
      ...canvasActions,
      { type: 'stroke', pen, points: currentPath.current },
    ]);

    setIsDrawing(true);
  });

  useEventListener(document, 'pointermove', e => {
    if (isDrawing) {
      const drawingCtx = drawingCanvasRef.current?.getContext('2d');
      if (!drawingCtx) return;

      currentPath.current.push(getPointerPosition(e, drawingCtx));

      redrawCanvas(drawingCtx, [
        ...canvasActions,
        { type: 'stroke', pen, points: currentPath.current },
      ]);
    }
  });

  useEventListener(document, 'pointerup', () => {
    if (isDrawing) {
      setIsDrawing(false);
      setCanvasActions([
        ...canvasActions,
        { type: 'stroke', pen, points: currentPath.current },
      ]);
      currentPath.current = [];
    }
  });

  // cursor
  useEventListener(canvasContainerRef, 'pointermove', e => {
    const hoverCtx = hoverCanvasRef.current?.getContext('2d');
    if (!hoverCtx) return;

    const points = [getPointerPosition(e, hoverCtx)];
    setupPen(hoverCtx, pen);
    clearCanvas(hoverCtx);

    if (pen.brushType === 'erase') {
      const outline: IPen = {
        brushType: BrushType.SOLID,
        penColour: Colour.BLACK,
        penThickness: penThickness + 2,
      };

      const middle: IPen = {
        brushType: BrushType.SOLID,
        penColour: Colour.WHITE,
        penThickness: penThickness,
      };

      hoverCtx.globalAlpha = 1;
      drawStroke(hoverCtx, { type: 'stroke', pen: outline, points });
      drawStroke(hoverCtx, { type: 'stroke', pen, points });
      hoverCtx.globalAlpha = 0.7;
      drawStroke(hoverCtx, { type: 'stroke', pen: middle, points });
      return;
    }

    hoverCtx.globalAlpha = 0.3;
    drawStroke(hoverCtx, { type: 'stroke', pen, points });
  });

  useEventListener(canvasContainerRef, 'pointerleave', () => {
    const hoverCtx = hoverCanvasRef.current?.getContext('2d');
    if (!hoverCtx) return;

    clearCanvas(hoverCtx);
  });

  // ctrl z
  useEventListener(document, 'keydown', e => {
    if (e.ctrlKey && e.key === 'z') {
      undo();
    }
  });

  useLayoutEffect(() => {
    const drawingCtx = drawingCanvasRef.current?.getContext('2d');
    if (!drawingCtx) return;

    redrawCanvas(drawingCtx, canvasActions);
  }, [canvasActions]);

  const undo = () => {
    setCanvasActions(canvasActions.slice(0, canvasActions.length - 1));
  };

  const clear = () => {
    setCanvasActions([...canvasActions, { type: 'clear' }]);
  };

  return (
    <div>
      <CanvasContainer ref={canvasContainerRef}>
        <canvas height={height} width={width} ref={drawingCanvasRef} />
        <canvas height={height} width={width} ref={hoverCanvasRef} />
      </CanvasContainer>
      <div>
        <button disabled={canvasActions.length === 0} onClick={undo}>
          Undo
        </button>
        <button onClick={clear}>Clear</button>
      </div>
      <BrushTypePicker
        currentBrushType={brushType}
        setBrushType={setBrushType}
      />
      <ThicknessPicker
        currentBrushType={brushType}
        currentColour={penColour}
        currentThickness={penThickness}
        setThickness={setPenThickness}
      />
      <ColourPicker currentColour={penColour} setColour={setPenColour} />
    </div>
  );
};
