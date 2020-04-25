import 'styled-components/macro';

import { Category, PromptCategories } from '@full-circle/shared/lib/prompts';
import { Box, FormField, Heading, Paragraph, Select } from 'grommet';
import { Add } from 'grommet-icons';
import React, { FunctionComponent, useState } from 'react';
import { LinkButton } from 'src/components/Link/LinkButton';
import { Navbar } from 'src/components/Navbar';
import { useRoom } from 'src/contexts/RoomContext';

const CreatePage: FunctionComponent = () => {
  const { createAndJoinRoom } = useRoom();
  const [loading, setLoading] = useState(false);
  const [promptSet, setPromptSet] = useState<Category>(PromptCategories[0]);

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
          width="medium"
          background="light-1"
          round="small"
          elevation="small"
        >
          <Heading level={2}>Choose Room Settings</Heading>
          <Box css={{ marginTop: 10, marginBottom: 10 }} flex>
            <FormField label="Prompt Pack" htmlFor="select-prompts">
              <Select
                data-testid="select-prompts"
                id="select-prompts"
                value={promptSet}
                options={PromptCategories}
                onChange={({ option }) => {
                  setPromptSet(option);
                }}
              ></Select>
            </FormField>
            <Paragraph size="small" fill>
              There are more features coming here to let you customise the game
              the way you find it fun. Custom game modes, user-submitted prompt
              packs and random challenges are being added soon.
            </Paragraph>
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
