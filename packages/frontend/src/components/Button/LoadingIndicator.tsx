import { Colour } from '@full-circle/shared/lib/canvas';
import React, { FunctionComponent } from 'react';
import styled, { css, keyframes } from 'styled-components';

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 0;
  }
`;

const DelayedBlinker = styled('span')<{ duration: string; delay: string }>`
  ${(props) => css`
    animation-name: ${fadeIn};
    animation-duration: ${props.duration};
    animation-timing-function: ease-in-out;
    animation-delay: ${props.delay};
    animation-iteration-count: infinite;
    color: ${Colour.BLUE};
  `}
`;

export const LoadingIndicator: FunctionComponent = () => {
  return (
    <div css={{ height: '100%' }}>
      <DelayedBlinker duration="1s" delay="0.25s">
        &#183;
      </DelayedBlinker>
      <DelayedBlinker duration="1s" delay="0.5s">
        &#183;
      </DelayedBlinker>
      <DelayedBlinker duration="1s" delay="0.75s">
        &#183;
      </DelayedBlinker>
    </div>
  );
};
