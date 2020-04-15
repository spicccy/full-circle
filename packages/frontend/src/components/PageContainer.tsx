import { Box, BoxTypes } from 'grommet';
import React, { FunctionComponent, useState } from 'react';
import { useEventListener } from 'src/hooks/useEventListener';

const PageContainer: FunctionComponent<BoxTypes> = (props) => {
  const [height, setHeight] = useState(window.innerHeight);

  useEventListener(window, 'resize', () => {
    setHeight(window.innerHeight);
  });

  return <Box height={{ min: `${height}px` }} {...props} />;
};

export { PageContainer };
