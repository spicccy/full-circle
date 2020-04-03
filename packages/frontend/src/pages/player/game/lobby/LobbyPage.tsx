import { Colour } from '@full-circle/shared/lib/canvas';
import { Box, Heading, Image } from 'grommet';
import React, { FunctionComponent } from 'react';
import { Card } from 'src/components/Card/Card';
import { LinkAnchor } from 'src/components/Link/LinkAnchor';
import { useRoom } from 'src/contexts/RoomContext';
import { ReactComponent as Close } from 'src/icons/close.svg';
import logo from 'src/images/fullcircle.png';
import styled from 'styled-components/macro';

const CloseButton = styled(LinkAnchor)`
  position: absolute;
  top: 0;
  right: 0;
  padding: 10px;

  :hover,
  :focus {
    fill: ${Colour.RED};
  }
`;

const Lobby: FunctionComponent = () => {
  const { roomCode, leaveRoom } = useRoom();

  return (
    <Box background="dark-1" fill align="center" justify="center" pad="medium">
      <Box width="medium">
        <Card
          css={{ position: 'relative' }}
          height="medium"
          align="center"
          justify="center"
        >
          <CloseButton href="/" onClick={leaveRoom}>
            <Close />
          </CloseButton>
          <Image
            a11yTitle="Full Circle"
            width={100}
            height={100}
            margin={{ right: 'small' }}
            src={logo}
          />
          <Heading level="2" textAlign="center">
            {roomCode ? `Joined room ${roomCode}` : `Joining room...`}
          </Heading>
          <Heading level="3" textAlign="center">
            Waiting for players...
          </Heading>
        </Card>
      </Box>
    </Box>
  );
};

export { Lobby };
