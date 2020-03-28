import { Box, Heading } from 'grommet';
import React, { FunctionComponent } from 'react';
import { usePhaseTimer } from 'src/hooks/usePhaseTimer';
import styled from 'styled-components';

const TimerContainer = styled(Box)`
  position: absolute;
  top: 0;
  right: 0;
  user-select: none;
`;

interface ICornerTimerProps {
  timer?: number;
}

const CornerTimer: FunctionComponent<ICornerTimerProps> = ({ timer }) => (
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
);

const PhaseTimer: FunctionComponent = () => {
  const timer = usePhaseTimer();

  return <CornerTimer timer={timer} />;
};

export { CornerTimer, PhaseTimer };
