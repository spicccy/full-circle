import { Colour } from '@full-circle/shared/lib/canvas';
import { Box } from 'grommet';
import React, { FunctionComponent } from 'react';
import styled from 'styled-components/macro';

const BackgroundCircle = styled(Box)`
  min-width: calc((90vw + 90vh) / 2);
  min-height: calc((90vw + 90vh) / 2);
`;

export const AllPlayersCircle: FunctionComponent = () => {
  return (
    <BackgroundCircle
      css={{ position: 'absolute' }}
      round="full"
      border={{ color: Colour.YELLOW, size: '5vw' }}
    ></BackgroundCircle>
  );
};
