import { StickyNoteColour } from '@full-circle/shared/lib/roomState';
import { Box } from 'grommet';
import styled, { css } from 'styled-components';

export interface IRandomStickyNoteData {
  angle: number;
  bendAmountLeft: number;
  bendAmountRight: number;
}

export const getRandomRotation = () => Math.random() * 20 - 10;
export const getRandomCornerBend = () => Math.random() * 3;

interface IStickyNoteProps {
  colour: StickyNoteColour;
  size: string;
  randomData?: IRandomStickyNoteData;
}

const StickyNote = styled(Box)<IStickyNoteProps>`
  font-family: PermanentMarker;
  background-color: ${(props) => props.colour};
  height: ${(props) => props.size};
  width: ${(props) => props.size};
  box-shadow: 1px 4px 3px rgba(33, 33, 33, 0.7);

  ${(props) =>
    props.randomData &&
    css`
      transform: rotate(${props.randomData.angle}deg);
      border-bottom-left-radius: 30px ${props.randomData.bendAmountLeft}px;
      border-bottom-right-radius: 30px ${props.randomData.bendAmountRight}px;
    `}
`;

export { StickyNote };
