import { Colour, PenThickness, PenType } from './constants';

export interface ICoord {
  x: number;
  y: number;
}

interface IBasePen {
  type: PenType;
}

export interface ISolidPen extends IBasePen {
  type: PenType.SOLID;
  penColour: Colour;
  penThickness: PenThickness;
}

export interface IEraserPen extends IBasePen {
  type: PenType.ERASE;
  penThickness: PenThickness;
}

export type Pen = ISolidPen | IEraserPen;
