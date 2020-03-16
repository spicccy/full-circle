import React, { FunctionComponent } from 'react';
import {
  BrushType,
  brushTypes,
} from '@full-circle/shared/lib/canvas/constants';

interface IBrushTypePickerProps {
  currentBrushType: BrushType;
  setBrushType(brushType: BrushType): void;
}

export const BrushTypePicker: FunctionComponent<IBrushTypePickerProps> = ({
  currentBrushType,
  setBrushType,
}) => (
  <div>
    <label>Brush Type</label>
    {brushTypes.map(brushType => (
      <button
        key={brushType}
        onClick={() => setBrushType(brushType)}
        style={{
          border:
            currentBrushType === brushType
              ? '2px inset gray'
              : '1px solid black',
        }}
      >
        {brushType}
      </button>
    ))}
  </div>
);
