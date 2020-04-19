import { Box } from 'grommet';
import React, { FunctionComponent } from 'react';
import { NoteBookClosed, NoteBookOpen } from 'src/icons';
import styled from 'styled-components/macro';

const NoteBookClosedBackground = styled(NoteBookClosed)`
  height: 80vh;
  width: 80vw;
`;

const NoteBookOpenBackground = styled(NoteBookOpen)`
  height: 80vh;
  width: 100vw;
`;

export const HomePagegBackground: FunctionComponent = () => {
  return (
    <Box
      css={{ position: 'absolute', zIndex: -1 }}
      flex
      align="center"
      justify="center"
    >
      <NoteBookClosedBackground preserveAspectRatio="none" />
      {/* <NoteBookOpenBackground preserveAspectRatio="none" /> */}
    </Box>
  );
};
