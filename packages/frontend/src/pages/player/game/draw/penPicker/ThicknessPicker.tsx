import {
  Colour,
  Pen,
  PenThickness,
  PenType,
} from '@full-circle/shared/lib/canvas';
import { Box, defaultProps } from 'grommet';
import React, { FunctionComponent } from 'react';
import { BaseButton } from 'src/components/BaseButton';
import { useEventListener } from 'src/hooks/useEventListener';
import styled, { css } from 'styled-components';

const ButtonWrapper = styled(BaseButton)<{
  selected: boolean;
}>`
  background-color: white;
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
    z-index: 1;
  }
`;

const Circle = styled.div<{ colour?: Colour; size: PenThickness }>`
  height: ${(props) => props.size}px;
  width: ${(props) => props.size}px;
  border-radius: ${(props) => props.size}px;
  ${(props) => {
    if (props.colour === Colour.WHITE) return `border: 2px solid black`;
    if (props.colour) return `background-color: ${props.colour}`;
    return css`
      border: 2px solid ${Colour.DARK_GRAY};
      background: repeating-linear-gradient(
        45deg,
        white,
        white 3px,
        ${Colour.LIGHT_GRAY} 3px,
        ${Colour.LIGHT_GRAY} 6px
      );
    `;
  }}
`;

const thicknesses = [
  { thickness: PenThickness.SMALL, title: 'small brush (1)' },
  { thickness: PenThickness.MEDIUM, title: 'medium brush (2)' },
  { thickness: PenThickness.LARGE, title: 'large brush (3)' },
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

  useEventListener(document, 'keydown', (e) => {
    switch (e.key) {
      case '1':
        return setThickness(PenThickness.SMALL);
      case '2':
        return setThickness(PenThickness.MEDIUM);
      case '3':
        return setThickness(PenThickness.LARGE);
    }
  });

  return (
    <Box direction="row">
      {thicknesses.map(({ thickness, title }) => (
        <ButtonWrapper
          key={thickness}
          selected={thickness === pen.penThickness}
          title={title}
          onClick={() => setThickness(thickness)}
        >
          <Circle colour={colour} size={thickness} />
        </ButtonWrapper>
      ))}
    </Box>
  );
};

export { ThicknessPicker };
