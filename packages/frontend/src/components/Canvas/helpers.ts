import {
  CanvasAction,
  clearCanvas,
  Colour,
  drawStroke,
  ICoord,
  Pen,
  PenType,
} from '@full-circle/shared/lib/canvas';
import { sumBy } from 'lodash';
import { getType } from 'typesafe-actions';

const clear = (ctx: CanvasRenderingContext2D) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
};

const getMidPoint = (...coords: ICoord[]): ICoord => {
  const xTotal = sumBy(coords, (coord) => coord.x);
  const yTotal = sumBy(coords, (coord) => coord.y);

  return {
    x: Math.floor(xTotal / coords.length),
    y: Math.floor(yTotal / coords.length),
  };
};

const setupPen = (ctx: CanvasRenderingContext2D, pen: Pen) => {
  switch (pen.type) {
    case PenType.ERASE: {
      ctx.lineWidth = pen.penThickness;

      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.globalCompositeOperation = 'destination-out';
      return;
    }

    case PenType.SOLID: {
      ctx.lineWidth = pen.penThickness;
      ctx.strokeStyle = pen.penColour;

      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.globalCompositeOperation = 'source-over';
      return;
    }
  }
};

const handleCanvasAction = (
  ctx: CanvasRenderingContext2D,
  canvasAction: CanvasAction
) => {
  switch (canvasAction.type) {
    case getType(clearCanvas): {
      clear(ctx);
      return;
    }

    case getType(drawStroke): {
      const { pen, points } = canvasAction.payload;
      if (points.length === 0) {
        return;
      }

      setupPen(ctx, pen);
      let p1 = points[0];
      let p2 = points[1];

      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);

      for (let i = 1; i < points.length; i++) {
        const midPoint = getMidPoint(p1, p2);
        ctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
        p1 = points[i];
        p2 = points[i + 1];
      }

      ctx.lineTo(p1.x, p1.y);
      ctx.stroke();
      ctx.closePath();
      return;
    }
  }
};

export const handleHover = (
  ctx: CanvasRenderingContext2D,
  pen: Pen,
  coord?: ICoord
) => {
  clear(ctx);

  if (!coord) {
    return;
  }

  const points = [coord];

  switch (pen.type) {
    case PenType.ERASE: {
      const outline: Pen = {
        type: PenType.SOLID,
        penColour: Colour.BLACK,
        penThickness: pen.penThickness + 2,
      };

      const middle: Pen = {
        type: PenType.SOLID,
        penColour: Colour.WHITE,
        penThickness: pen.penThickness,
      };

      ctx.globalAlpha = 1;
      handleCanvasAction(ctx, drawStroke({ points, pen: outline }));
      handleCanvasAction(ctx, drawStroke({ points, pen }));
      ctx.globalAlpha = 0.7;
      handleCanvasAction(ctx, drawStroke({ pen: middle, points }));
      return;
    }

    case PenType.SOLID: {
      ctx.globalAlpha = 0.3;
      handleCanvasAction(ctx, drawStroke({ points, pen }));
    }
  }
};

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

export const redrawCanvas = (
  ctx: CanvasRenderingContext2D,
  strokes: CanvasAction[] = []
) => {
  clear(ctx);
  for (const stroke of strokes) {
    handleCanvasAction(ctx, stroke);
  }
};
