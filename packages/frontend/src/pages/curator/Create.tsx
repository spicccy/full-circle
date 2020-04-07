import { Box, Heading, Paragraph } from 'grommet';
import { Add } from 'grommet-icons';
import React, { FunctionComponent, useState } from 'react';
import { LinkButton } from 'src/components/Link/LinkButton';
import { Navbar } from 'src/components/Navbar';
import { useRoom } from 'src/contexts/RoomContext';

const CreatePage: FunctionComponent = () => {
  const { createAndJoinRoom } = useRoom();
  const [loading, setLoading] = useState(false);

  const createLobby = async () => {
    setLoading(true);
    const createdRoom = await createAndJoinRoom();
    setLoading(false);
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
            loading={loading}
            alignSelf="center"
            label="Create"
            icon={<Add />}
            href="/curator"
            onClick={createLobby}
          />
        </Box>
      </Box>
    </Box>
  );
};

export { CreatePage };
