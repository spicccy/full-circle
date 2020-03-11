import React, { FunctionComponent } from 'react';
import { PenThickness, penThicknesses, Colour, BrushType } from './constants';

interface IThicknessPickerProps {
  currentBrushType: BrushType;
  currentThickness: PenThickness;
  currentColour: Colour;
  setThickness(thickness: PenThickness): void;
}

export const ThicknessPicker: FunctionComponent<IThicknessPickerProps> = ({
  currentBrushType,
  currentThickness,
  currentColour,
  setThickness,
}) => (
  <div style={{ display: 'flex' }}>
    <label>Pen thickness</label>
    {penThicknesses.map(thickness => (
      <div
        key={thickness}
        onClick={() => setThickness(thickness)}
        style={{
          cursor: 'pointer',
          height: 50,
          width: 50,
          border:
            currentThickness === thickness
              ? '4px inset gray'
              : '1px solid black',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            backgroundColor:
              currentBrushType === BrushType.ERASE ? 'white' : currentColour,
            border:
              currentBrushType === BrushType.ERASE
                ? '1px solid black'
                : undefined,
            height: thickness,
            width: thickness,
            borderRadius:
              currentBrushType === BrushType.HIGHLIGHTER ? '0' : '50%',
            position: 'absolute',
          }}
        />
      </div>
    ))}
  </div>
);
