import { Colour } from '@full-circle/shared/lib/canvas';
import { Box } from 'grommet';
import React, { FunctionComponent } from 'react';
import styled from 'styled-components/macro';

const BackgroundCircle = styled(Box)`
  min-width: 90vh;
  min-height: 90vh;
`;

export const AllPlayersCircle: FunctionComponent = () => {
  return (
    <BackgroundCircle
      css={{ position: 'absolute' }}
      round="full"
      border={{ color: Colour.YELLOW, size: '3vw' }}
    ></BackgroundCircle>
  );
};
