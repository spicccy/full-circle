import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

interface ICirclePositionerProps {
  angle: number;
}

const Container = styled.div<ICirclePositionerProps>`
  position: absolute;
  transform: rotate(${(props) => props.angle}deg)
    translateX(calc((80vw + 80vh) / 4));
`;

const Positioner = styled.div<{ angle: number }>`
  transform: rotate(${(props) => props.angle}deg);
`;

const CirclePositioner: FunctionComponent<ICirclePositionerProps> = ({
  angle,
  children,
  ...props
}) => (
  <Container angle={angle} {...props}>
    <Positioner angle={-angle}>{children}</Positioner>
  </Container>
);

export { CirclePositioner };
