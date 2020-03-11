import { BrushType, Colour, PenThickness } from './constants';

export interface ICoord {
  x: number;
  y: number;
}

export interface IPen {
  brushType: BrushType;
  penColour: Colour;
  penThickness: PenThickness;
}

export interface IStrokeAction {
  type: 'stroke';
  pen: IPen;
  points: ICoord[];
}

export interface IClearAction {
  type: 'clear';
}

export type CanvasAction = IStrokeAction | IClearAction;
