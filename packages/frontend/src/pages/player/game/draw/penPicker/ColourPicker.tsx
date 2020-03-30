import { Colour, Pen, PenType } from '@full-circle/shared/lib/canvas';
import { Box, defaultProps } from 'grommet';
import React, { FunctionComponent } from 'react';
import { BaseButton } from 'src/components/BaseButton';
import { useEventListener } from 'src/hooks/useEventListener';
import styled from 'styled-components';

import { ReactComponent as Eraser } from '../../icons/eraser.svg';

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
  { colour: Colour.WHITE, title: 'white (q)' },
  { colour: Colour.LIGHT_GRAY, title: 'light gray (w)' },
  { colour: Colour.RED, title: 'red (e)' },
  { colour: Colour.YELLOW, title: 'yellow (r)' },
  { colour: Colour.GREEN, title: 'green (t)' },
  { colour: Colour.PURPLE, title: 'purple (y)' },
];

const row2 = [
  { colour: Colour.BLACK, title: 'black (a)' },
  { colour: Colour.DARK_GRAY, title: 'dark gray (s)' },
  { colour: Colour.ORANGE, title: 'orange (d)' },
  { colour: Colour.LIGHT_GREEN, title: 'light green (f)' },
  { colour: Colour.BLUE, title: 'blue (g)' },
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
    switch (e.key) {
      case 'q':
        return setColour(row1[0].colour);
      case 'w':
        return setColour(row1[1].colour);
      case 'e':
        return setColour(row1[2].colour);
      case 'r':
        return setColour(row1[3].colour);
      case 't':
        return setColour(row1[4].colour);
      case 'y':
        return setColour(row1[5].colour);

      case 'a':
        return setColour(row2[0].colour);
      case 's':
        return setColour(row2[1].colour);
      case 'd':
        return setColour(row2[2].colour);
      case 'f':
        return setColour(row2[3].colour);
      case 'g':
        return setColour(row2[4].colour);
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
