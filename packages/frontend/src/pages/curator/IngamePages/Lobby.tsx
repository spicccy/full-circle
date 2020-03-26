import { Box, Button, Heading, Paragraph } from 'grommet';
import { Add } from 'grommet-icons';
import React, { FunctionComponent } from 'react';
import { LinkButton } from 'src/components/Link/LinkButton';
import { useRoom } from 'src/contexts/RoomContext';
import { PlayerBox, ICoord } from 'src/components/PlayerBox';
import { useRoomState } from 'src/hooks/useRoomState';
import { objectValues } from 'src/helpers';
import logo from 'src/images/fullcircle.png';

interface ILobbyProps {
  startGame(): void;
}

const Lobby: FunctionComponent<ILobbyProps> = ({ startGame }) => {
  const { room } = useRoom();
  const players = useRoomState()?.players;

  const arrayOfPlayers = players ? objectValues(players) : [];
  const arrayOfCoords: ICoord[] = [
    { x: 100, y: 100 },
    { x: 600, y: 50 },
    { x: 350, y: 300 },
    { x: 1200, y: 100 },
    { x: 1000, y: 300 },
    { x: 1100, y: 400 },
    { x: 900, y: 600 },
    { x: 200, y: 500 }
  ];

  const playerBoxes = arrayOfCoords.map((coord, index) => (
    <PlayerBox coord={coord} player={arrayOfPlayers[index]} key={index} />
  ));

  return (
    <Box background="light-2" fill>
      <LinkButton alignSelf="start" label="Back" href="/home" />
      <Box flex align="center" justify="center">
        <Box width="medium" align="center">
          <img alt="Full Circle" width={100} height={100} src={logo} />
          <Heading>Full Circle</Heading>
          <Box align="center">
            <Paragraph>Room ID : {room?.id} </Paragraph>
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
