import {
  ICoord,
  IPen,
  CanvasAction,
} from '@full-circle/shared/lib/canvas/interfaces';
import { BrushType } from '@full-circle/shared/lib/canvas/constants';

// https://stackoverflow.com/questions/17130395/real-mouse-position-in-canvas
export const getPointerPosition = (
  e: PointerEvent,
  ctx: CanvasRenderingContext2D
): ICoord => {
  const { left, top, width, height } = ctx.canvas.getBoundingClientRect();
  const scaleX = ctx.canvas.width / width;
  const scaleY = ctx.canvas.height / height;

  return {
    x: (e.clientX - left) * scaleX,
    y: (e.clientY - top) * scaleY,
  };
};

export const setupPen = (ctx: CanvasRenderingContext2D, pen: IPen) => {
  ctx.lineWidth = pen.penThickness;
  ctx.strokeStyle = pen.penColour;

  if (pen.brushType === BrushType.SOLID) {
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.globalCompositeOperation = 'source-over';
    return;
  }
  if (pen.brushType === BrushType.HIGHLIGHTER) {
    ctx.lineJoin = 'bevel';
    ctx.lineCap = 'square';
    ctx.globalCompositeOperation = 'multiply';
    return;
  }

  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.globalCompositeOperation = 'destination-out';
};

export const clearCanvas = (ctx: CanvasRenderingContext2D) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
};

export const getMidPoint = (...coords: ICoord[]): ICoord => {
  const xTotal = coords.reduce((total, value) => total + value.x, 0);
  const yTotal = coords.reduce((total, value) => total + value.y, 0);
  return {
    x: Math.floor(xTotal / coords.length),
    y: Math.floor(yTotal / coords.length),
  };
};

export const drawStroke = (
  ctx: CanvasRenderingContext2D,
  stroke: CanvasAction
) => {
  switch (stroke.type) {
    case 'clear': {
      clearCanvas(ctx);
      return;
    }

    case 'stroke': {
      if (stroke.points.length === 0) {
        return;
      }

      setupPen(ctx, stroke.pen);
      let p1 = stroke.points[0];
      let p2 = stroke.points[1];

      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);

      for (let i = 1; i < stroke.points.length; i++) {
        const midPoint = getMidPoint(p1, p2);
        ctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
        p1 = stroke.points[i];
        p2 = stroke.points[i + 1];
      }
      ctx.lineTo(p1.x, p1.y);
      ctx.stroke();
      ctx.closePath();
      return;
    }

    default: {
      throw Error('Action not supported');
    }
  }
};

export const redrawCanvas = (
  ctx: CanvasRenderingContext2D,
  strokes: CanvasAction[]
) => {
  clearCanvas(ctx);
  for (const stroke of strokes) {
    drawStroke(ctx, stroke);
  }
};
