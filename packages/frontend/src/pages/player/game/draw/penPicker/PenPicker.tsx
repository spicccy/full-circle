import { Pen } from '@full-circle/shared/lib/canvas';
import { Box } from 'grommet';
import React, { FunctionComponent } from 'react';

import { ColourPicker } from './ColourPicker';
import { ThicknessPicker } from './ThicknessPicker';

interface IPenPicker {
  pen: Pen;
  setPen(pen: Pen): void;
}

const PenPicker: FunctionComponent<IPenPicker> = ({ pen, setPen }) => (
  <Box direction="row" justify="around" align="center" wrap>
    <ColourPicker pen={pen} setPen={setPen} />
    <ThicknessPicker pen={pen} setPen={setPen} />
  </Box>
);

export { PenPicker };
