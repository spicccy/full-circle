import { Colour, Pen, PenType } from '@full-circle/shared/lib/canvas';
import { Box, defaultProps } from 'grommet';
import React, { FunctionComponent } from 'react';
import { BaseButton } from 'src/components/BaseButton';
import { useEventListener } from 'src/hooks/useEventListener';
import { Eraser } from 'src/icons';
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
  background-color: white;
  border-width: 4px;
  border-color: ${defaultProps.theme.global?.colors?.['dark-1']};
  border-style: ${(props) => (props.selected ? 'solid' : 'none')};
  height: 36px;
  min-width: 36px;
  align-items: center;
  justify-content: center;

  svg {
    fill: ${Colour.DARK_GRAY};
  }

  :focus {
    outline: 2px dashed black;
  }
`;

const ColourRow = styled(Box)<{ top: boolean }>`
  > :first-child {
    ${(props) =>
      props.top
        ? `border-top-left-radius: 4px;`
        : `border-bottom-left-radius: 4px;`}
  }

  > :last-child {
    ${(props) =>
      props.top
        ? `border-top-right-radius: 4px;`
        : `border-bottom-right-radius: 4px;`}
  }
`;

const row1 = [
  { colour: Colour.WHITE, title: 'white (q)', key: 'q' },
  { colour: Colour.LIGHT_GRAY, title: 'light gray (w)', key: 'w' },
  { colour: Colour.RED, title: 'red (e)', key: 'e' },
  { colour: Colour.YELLOW, title: 'yellow (r)', key: 'r' },
  { colour: Colour.GREEN, title: 'green (t)', key: 't' },
  { colour: Colour.PURPLE, title: 'purple (y)', key: 'y' },
];

const row2 = [
  { colour: Colour.BLACK, title: 'black (a)', key: 'a' },
  { colour: Colour.DARK_GRAY, title: 'dark gray (s)', key: 's' },
  { colour: Colour.ORANGE, title: 'orange (d)', key: 'd' },
  { colour: Colour.LIGHT_GREEN, title: 'light green (f)', key: 'f' },
  { colour: Colour.BLUE, title: 'blue (g)', key: 'g' },
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

  useEventListener(document, 'keydown', (e) => {
    [...row1, ...row2].forEach(({ key, colour }) => {
      if (e.key === key) {
        setColour(colour);
      }
    });

    switch (e.key) {
      case 'h':
        return setEraser();
    }
  });

  return (
    <Box margin="medium">
      <ColourRow direction="row" top={true}>
        {row1.map(({ colour, title }) => (
          <ColourBlock
            key={colour}
            title={title}
            colour={colour}
            selected={colour === currentColour}
            onClick={() => setColour(colour)}
            data-testid={title}
          />
        ))}
      </ColourRow>
      <ColourRow direction="row" top={false}>
        {row2.map(({ colour, title }) => (
          <ColourBlock
            key={colour}
            title={title}
            colour={colour}
            selected={colour === currentColour}
            onClick={() => setColour(colour)}
            data-testid={title}
          />
        ))}
        <EraserBlock
          selected={pen.type === PenType.ERASE}
          onClick={setEraser}
          title="eraser (h)"
        >
          <Eraser />
        </EraserBlock>
      </ColourRow>
    </Box>
  );
};

export { ColourPicker };
