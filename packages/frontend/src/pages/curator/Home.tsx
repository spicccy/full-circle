import { Box, Heading, Paragraph } from 'grommet';
import { Add } from 'grommet-icons';
import React, { FunctionComponent } from 'react';
import { LinkButton } from 'src/components/Link/LinkButton';
import { Navbar } from 'src/components/Navbar';
import { useRoom } from 'src/contexts/RoomContext';

const HomePage: FunctionComponent = () => {
  const { createAndJoinRoom } = useRoom();

  const createLobby = async () => {
    const createdRoom = await createAndJoinRoom();
    return Boolean(createdRoom);
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
          <LinkButton
            data-testid="createGame"
            alignSelf="center"
            label="Create"
            icon={<Add />}
            href="/game"
            onClick={createLobby}
          />
          <LinkButton
            alignSelf="center"
            label="Timer Test"
            icon={<Add />}
            href="/timertest"
            onClick={createLobby}
          />
        </Box>
      </Box>
    </Box>
  );
};

export { HomePage };
