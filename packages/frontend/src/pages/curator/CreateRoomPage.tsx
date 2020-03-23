import React, { FunctionComponent } from 'react';
import { Box, Heading, Button, Paragraph } from 'grommet';
import { Add } from 'grommet-icons';
import { useHistory } from 'react-router-dom';
import { Navbar } from 'src/components/Navbar';

import { useRoom } from 'src/contexts/RoomContext';

const CreateRoomPage: FunctionComponent = () => {
  const history = useHistory();
  const room = useRoom();

  const createLobby = async () => {
    await room.createAndJoinRoom();
    history.push('/lobby');
  };

  return (
    <Box background="light-2" fill>
      <Navbar />
      <Box flex align="center" justify="center">
        <Box width="medium">
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
        </Box>
      </Box>
    </Box>
  );
};

export { CreateRoomPage };
