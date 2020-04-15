import { Box, BoxTypes } from 'grommet';
import React, { FunctionComponent } from 'react';

const Background: FunctionComponent<BoxTypes> = (props) => {
  return (
    <Box
      background="dark-1"
      flex
      align="center"
      justify="center"
      pad="medium"
      {...props}
    />
  );
};

export { Background };
