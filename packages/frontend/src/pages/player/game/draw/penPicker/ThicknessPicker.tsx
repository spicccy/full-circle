import {
  Colour,
  Pen,
  PenThickness,
  PenType,
} from '@full-circle/shared/lib/canvas';
import { Box, defaultProps } from 'grommet';
import React, { FunctionComponent } from 'react';
import { BaseButton } from 'src/components/BaseButton';
import styled from 'styled-components';

const ButtonWrapper = styled(BaseButton)<{
  selected: boolean;
}>`
  justify-content: center;
  align-items: center;
  border-width: 4px;
  border-color: ${defaultProps.theme.global?.colors?.['dark-1']};
  border-style: ${(props) => (props.selected ? 'solid' : 'none')};
  height: 48px;
  min-width: 48px;
  border-radius: 4px;
  margin: 4px;

  :focus {
    outline: 2px dashed black;
  }
`;

const Circle = styled.div<{ colour?: Colour; size: PenThickness }>`
  height: ${(props) => props.size}px;
  width: ${(props) => props.size}px;
  border-radius: ${(props) => props.size}px;
  ${(props) =>
    props.colour
      ? `background-color: ${props.colour}`
      : `border: 2px solid black`}
`;

const thicknesses = [
  PenThickness.SMALL,
  PenThickness.MEDIUM,
  PenThickness.LARGE,
];

interface IThicknessPickerProps {
  pen: Pen;
  setPen(pen: Pen): void;
}

const ThicknessPicker: FunctionComponent<IThicknessPickerProps> = ({
  pen,
  setPen,
}) => {
  const colour = pen.type === PenType.SOLID ? pen.penColour : undefined;

  const setThickness = (penThickness: PenThickness) =>
    setPen({ ...pen, penThickness });

  return (
    <Box direction="row">
      {thicknesses.map((thickness) => (
        <ButtonWrapper
          key={thickness}
          selected={thickness === pen.penThickness}
          onClick={() => setThickness(thickness)}
        >
          <Circle colour={colour} size={thickness} />
        </ButtonWrapper>
      ))}
    </Box>
  );
};

export { ThicknessPicker };
