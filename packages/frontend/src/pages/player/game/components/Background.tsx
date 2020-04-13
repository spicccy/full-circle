import { Box, BoxTypes } from 'grommet';
import React, { FunctionComponent } from 'react';

const Background: FunctionComponent<BoxTypes> = (props) => (
  <Box
    background="dark-1"
    flex
    height={{ min: '100vh' }}
    align="center"
    justify="center"
    pad="medium"
    {...props}
  />
);

export { Background };
