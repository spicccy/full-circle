import { Box, Heading, Image } from 'grommet';
import React, { FunctionComponent } from 'react';
import { Card } from 'src/components/Card/Card';
import { useRoom } from 'src/contexts/RoomContext';
import logo from 'src/images/fullcircle.png';

import { Background } from '../components/Background';
import { CloseButton } from '../components/CloseButton';

const Lobby: FunctionComponent = () => {
  const { roomCode } = useRoom();

  return (
    <Background>
      <Box width="medium">
        <Card
          css={{ position: 'relative' }}
          height="medium"
          align="center"
          justify="center"
        >
          <CloseButton />
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
    </Background>
  );
};

export { Lobby };
