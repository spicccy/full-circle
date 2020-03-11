const numberValues = (items: object): number[] =>
  Object.values(items).filter(value => typeof value === 'number');

export enum Colour {
  NAVY = '#001F3F',
  BLUE = '#0074D9',
  AQUA = '#7FDBFF',
  TEAL = '#39CCCC',
  OLIVE = '#3D9970',
  GREEN = '#2ECC40',
  LIME = '#01FF70',
  YELLOW = '#FFDC00',
  ORANGE = '#FF851B',
  RED = '#FF4136',
  MAROON = '#85144B',
  FUCHSIA = '#F012BE',
  PURPLE = '#B10DC9',
  BLACK = '#111111',
  GRAY = '#AAAAAA',
  SILVER = '#DDDDDD',
  WHITE = '#FFFFFF',
}
export const colours: Colour[] = Object.values(Colour);

export enum PenThickness {
  XSMALL = 2,
  SMALL = 8,
  MEDIUM = 16,
  LARGE = 32,
  XLARGE = 48,
}
export const penThicknesses: PenThickness[] = numberValues(PenThickness);

export enum BrushType {
  SOLID = 'solid',
  HIGHLIGHTER = 'highlighter',
  ERASE = 'erase',
}
export const brushTypes: BrushType[] = Object.values(BrushType);
