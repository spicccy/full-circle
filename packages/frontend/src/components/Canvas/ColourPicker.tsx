import React, { FunctionComponent } from 'react';
import { colours, Colour } from '@full-circle/shared/lib/canvas/constants';

interface IColourPickerProps {
  currentColour: Colour;
  setColour(colour: Colour): void;
}

export const ColourPicker: FunctionComponent<IColourPickerProps> = ({
  currentColour,
  setColour,
}) => (
  <div style={{ display: 'flex' }}>
    <label>Colour picker</label>
    {colours.map(colour => (
      <div
        key={colour}
        onClick={() => setColour(colour)}
        style={{
          cursor: 'pointer',
          height: 50,
          width: 50,
          backgroundColor: colour,
          border: currentColour === colour ? '4px inset gray' : '',
        }}
      />
    ))}
  </div>
);
