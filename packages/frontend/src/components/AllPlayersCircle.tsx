import { Box } from 'grommet';
import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

const BackgroundCircle = styled(Box)`
  min-width: calc((90vw + 90vh) / 2);
  min-height: calc((90vw + 90vh) / 2);
`;

export const AllPlayersCircle: FunctionComponent = () => {
  return (
    <BackgroundCircle
      round="full"
      border={{ color: 'blue', size: '5vw' }}
    ></BackgroundCircle>
  );
};
