import { PromptCategories } from '@full-circle/shared/lib/prompts';
import { Box, Heading, Select } from 'grommet';
import { Add } from 'grommet-icons';
import React, { FunctionComponent, useState } from 'react';
import { LinkButton } from 'src/components/Link/LinkButton';
import { Navbar } from 'src/components/Navbar';
import { useRoom } from 'src/contexts/RoomContext';

const CreatePage: FunctionComponent = () => {
  const { createAndJoinRoom } = useRoom();
  const [loading, setLoading] = useState(false);
  const [promptSet, setPromptSet] = useState(PromptCategories[0]);

  const createLobby = async () => {
    setLoading(true);
    const createdRoom = await createAndJoinRoom({ promptPack: promptSet });
    setLoading(false);
    return Boolean(createdRoom);
  };

  return (
    <Box css={{ position: 'relative' }} flex>
      <Navbar />
      <Box flex align="center" justify="center" background="light-2">
        <Box
          pad="medium"
          width="large"
          background="light-1"
          round="small"
          elevation="small"
        >
          <Heading level={2}>Choose Room Settings</Heading>
          <Box flex>
            <Select
              value={promptSet}
              options={PromptCategories}
              onChange={({ option }) => {
                setPromptSet(option);
              }}
            ></Select>
          </Box>
          <LinkButton
            data-testid="createGame"
            loading={loading}
            alignSelf="center"
            label="Create Room"
            icon={<Add />}
            href="/curator"
            onClick={createLobby}
            size="large"
          />
        </Box>
      </Box>
    </Box>
  );
};

export { CreatePage };
