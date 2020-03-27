import { Box, Button, Heading, Paragraph } from 'grommet';
import { Add } from 'grommet-icons';
import React, { FunctionComponent } from 'react';
import { useHistory } from 'react-router-dom';
import { Navbar } from 'src/components/Navbar';
import { useRoom } from 'src/contexts/RoomContext';

const HomePage: FunctionComponent = () => {
  const history = useHistory();
  const room = useRoom();

  const createLobby = async () => {
    await room.createAndJoinRoom();
    history.push('/game');
  };

  return (
    <Box background="light-2" fill>
      <Navbar />
      <Box flex align="center" justify="center">
        <Box width="medium" align="center">
          <Heading>Create a Room</Heading>
          <Box align="center">
            <Paragraph>
              There are more features coming to this area. Players will be able
              to choose game rules and customise the number of rounds/players.
            </Paragraph>
            <Paragraph>
              For now, it simply creates a room in the backend that other
              players can join.
            </Paragraph>
          </Box>
          <Button
            alignSelf="center"
            label="Create"
            icon={<Add />}
            onClick={createLobby}
          />
          <Button
            alignSelf="center"
            label="Timer Test"
            icon={<Add />}
            onClick={async () => {
              await room.createAndJoinRoom();
              history.push('/timertest');
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export { HomePage };
