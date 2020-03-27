import { CanvasAction } from '@full-circle/shared/lib/canvas/interfaces';
import { Box, Grommet, Heading } from 'grommet';
import React, { FunctionComponent } from 'react';
import { ViewCanvas } from 'src/components/Canvas/ViewCanvas';
import { notepadTheme } from 'src/styles/notepadTheme';
import styled from 'styled-components';

const Card = styled(Box)`
  position: relative;
  overflow: hidden;
`;

const TimerContainer = styled(Box)`
  position: absolute;
  top: 0;
  right: 0;
  user-select: none;
`;

interface IDrawingCardProps {
  receivedArtist?: string;
  receivedDrawing?: CanvasAction[];
  timer?: number;
}

const DrawingCard: FunctionComponent<IDrawingCardProps> = ({
  receivedArtist,
  receivedDrawing = [],
  timer,
}) => (
  <Grommet theme={notepadTheme}>
    <Card background="light-1" elevation="large" round="small">
      <Box align="center">
        <Heading margin={{ bottom: 'none' }}>Guess!</Heading>
        <Heading level="3" margin="small" textAlign="center">
          {receivedArtist ? `${receivedArtist}'s drawing` : 'Loading...'}
        </Heading>
      </Box>
      <TimerContainer
        background="dark-4"
        justify="center"
        pad="small"
        width={{ min: '64px' }}
        round={{ corner: 'bottom-left', size: 'small' }}
      >
        <Heading level="2" margin="none" textAlign="center" responsive={false}>
          {timer ?? '-'}
        </Heading>
      </TimerContainer>

      <ViewCanvas canvasActions={receivedDrawing} />
    </Card>
  </Grommet>
);

export { DrawingCard };
