import 'styled-components/macro';

import { Box, Button, Heading, Paragraph } from 'grommet';
import { Add } from 'grommet-icons';
import React, { FunctionComponent } from 'react';
import { AllPlayersCircle } from 'src/components/AllPlayersCircle';
import { LinkButton } from 'src/components/Link/LinkButton';
import { Player } from 'src/components/Player';
import { useRoom } from 'src/contexts/RoomContext';
import { objectValues } from 'src/helpers';
import { useRoomState } from 'src/hooks/useRoomState';
import logo from 'src/images/fullcircle.png';
import styled from 'styled-components/macro';

const locationBox = styled(Box)``;

interface ILobbyProps {
  startGame(): void;
}

const arrayOfAngles: number[] = [10, 30, 170, 150, 190, 210, 330, 350];

const Lobby: FunctionComponent<ILobbyProps> = ({ startGame }) => {
  const roomContext = useRoom();
  const players = useRoomState()?.players;

  const arrayOfPlayers = players ? objectValues(players) : [];

  const playerBoxes = arrayOfAngles.map((angle, index) => (
    <Player angle={angle} player={arrayOfPlayers[index]} key={index} />
  ));

  return (
    <Box css={{ position: 'relative' }} fill>
      <Box
        css={{ position: 'absolute', zIndex: -1 }}
        overflow="hidden"
        fill
        align="center"
        justify="center"
      >
        <AllPlayersCircle />
      </Box>
      <Box
        css={{ position: 'absolute', zIndex: -1 }}
        overflow="hidden"
        fill
        align="center"
        justify="center"
      >
        {playerBoxes}
      </Box>
      <LinkButton alignSelf="start" label="Back" href="/home" />
      <Box flex align="center" justify="center">
        <Box width="medium" align="center">
          <img alt="Full Circle" width={100} height={100} src={logo} />
          <Heading>Full Circle</Heading>
          <Box align="center">
            <Paragraph>
              Room ID : {roomContext.room ? roomContext.roomCode : 'N/A'}
            </Paragraph>
          </Box>
          {playerBoxes}
          <Button
            alignSelf="center"
            label="Start Game"
            icon={<Add />}
            onClick={startGame}
          />
        </Box>
      </Box>
    </Box>
  );
};

export { Lobby };
