import { Box, Heading, Paragraph, Grommet } from 'grommet';
import React, { FunctionComponent } from 'react';
import { Navbar } from 'src/components/Navbar';
import { theme } from 'src/styles/theme';
import { StickyNote } from 'src/components/StickyNote';
import { StickyNoteColour } from '@full-circle/shared/lib/roomState';

const Team: FunctionComponent = () => {
  return (
    <Box fill flex>
      <Navbar />
      <Box flex align="center" justify="center">
        <Box flex width="large" pad="medium" align="center">
          <Heading level={1}>Team Members</Heading>
          <Box align="start">
            <StickyNote
              colour={StickyNoteColour.RED}
              size="medium"
              pad="medium"
              randomData={{ angle: 2, bendAmountLeft: 1, bendAmountRight: 0 }}
            >
              <Grommet theme={theme}>
                <Heading level="2">Alexander Su</Heading>
                <Paragraph>
                  Hi I am wholesome. I am like really good at coding and you
                  will always find me cool, calm and collected. Also, everyone
                  is hacking except me and I hate yml.
                </Paragraph>
              </Grommet>
            </StickyNote>
            <StickyNote
              colour={StickyNoteColour.YELLOW}
              size="medium"
              pad="medium"
              randomData={{ angle: -1, bendAmountLeft: 0, bendAmountRight: 2 }}
            >
              <Grommet theme={theme}>
                <Heading level="2">Tony Dong</Heading>
                <Paragraph>
                  Filler. Filler. Filler. Filler. Filler. Filler. Filler.
                  Filler. Filler. Filler. Filler. Filler. Filler.
                </Paragraph>
              </Grommet>
            </StickyNote>
            <StickyNote
              colour={StickyNoteColour.CYAN}
              size="medium"
              pad="medium"
              randomData={{ angle: 4, bendAmountLeft: 1, bendAmountRight: -1 }}
            >
              <Grommet theme={theme}>
                <Heading level="2">Winson Quan</Heading>
                <Paragraph>
                  Filler. Filler. Filler. Filler. Filler. Filler. Filler.
                  Filler. Filler. Filler. Filler. Filler. Filler.
                </Paragraph>
              </Grommet>
            </StickyNote>
            <StickyNote
              colour={StickyNoteColour.GREEN}
              size="medium"
              pad="medium"
              randomData={{ angle: 2, bendAmountLeft: 1, bendAmountRight: 0 }}
            >
              <Grommet theme={theme}>
                <Heading level="2">Daniel Huang</Heading>
                <Paragraph>
                  Filler. Filler. Filler. Filler. Filler. Filler. Filler.
                  Filler. Filler. Filler. Filler. Filler. Filler.
                </Paragraph>
              </Grommet>
            </StickyNote>
            <StickyNote
              colour={StickyNoteColour.BLUE}
              size="medium"
              pad="medium"
              randomData={{ angle: -3, bendAmountLeft: -2, bendAmountRight: 1 }}
            >
              <Grommet theme={theme}>
                <Heading level="2">Damien Chan</Heading>
                <Paragraph>
                  Filler. Filler. Filler. Filler. Filler. Filler. Filler.
                  Filler. Filler. Filler. Filler. Filler. Filler.
                </Paragraph>
              </Grommet>
            </StickyNote>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export { Team };
