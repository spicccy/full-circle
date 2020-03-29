import { Colour, Pen, PenType } from '@full-circle/shared/lib/canvas';
import { Box, defaultProps } from 'grommet';
import React, { FunctionComponent } from 'react';
import { BaseButton } from 'src/components/BaseButton';
import styled from 'styled-components';

const ColourBlock = styled(BaseButton)<{
  selected?: boolean;
  colour: Colour;
}>`
  background-color: ${(props) => props.colour};
  border-width: 4px;
  border-color: ${defaultProps.theme.global?.colors?.['dark-1']};
  border-style: ${(props) => (props.selected ? 'solid' : 'none')};
  height: 36px;
  min-width: 36px;

  :focus {
    outline: 2px dashed black;
    z-index: 1;
  }
`;

const EraserBlock = styled(BaseButton)<{
  selected: boolean;
}>`
  border-width: 4px;
  border-color: ${defaultProps.theme.global?.colors?.['dark-1']};
  border-style: ${(props) => (props.selected ? 'solid' : 'none')};
  height: 36px;
  min-width: 36px;

  :focus {
    outline: 2px dashed black;
  }
`;

const row1: Colour[] = [
  Colour.WHITE,
  Colour.LIGHT_GRAY,
  Colour.RED,
  Colour.YELLOW,
  Colour.GREEN,
  Colour.PURPLE,
];

const row2: Colour[] = [
  Colour.BLACK,
  Colour.DARK_GRAY,
  Colour.ORANGE,
  Colour.LIGHT_GREEN,
  Colour.BLUE,
];

interface IColourPickerProps {
  pen: Pen;
  setPen(pen: Pen): void;
}

const ColourPicker: FunctionComponent<IColourPickerProps> = ({
  pen,
  setPen,
}) => {
  const currentColour = pen.type === PenType.SOLID ? pen.penColour : undefined;

  const setColour = (penColour: Colour) =>
    setPen({ type: PenType.SOLID, penColour, penThickness: pen.penThickness });

  const setEraser = () =>
    setPen({ type: PenType.ERASE, penThickness: pen.penThickness });

  return (
    <Box margin="medium">
      <Box direction="row">
        {row1.map((colour) => (
          <ColourBlock
            key={colour}
            colour={colour}
            selected={colour === currentColour}
            onClick={() => setColour(colour)}
          />
        ))}
      </Box>
      <Box direction="row">
        {row2.map((colour) => (
          <ColourBlock
            key={colour}
            colour={colour}
            selected={colour === currentColour}
            onClick={() => setColour(colour)}
          />
        ))}
        <EraserBlock selected={pen.type === PenType.ERASE} onClick={setEraser}>
          E
        </EraserBlock>
      </Box>
    </Box>
  );
};

export { ColourPicker };
