import 'styled-components/macro';

import {
  PromptCategories,
  PromptCategory,
} from '@full-circle/shared/lib/roomState';
import { Box, FormField, Heading, Paragraph, Select } from 'grommet';
import { Add } from 'grommet-icons';
import React, { FunctionComponent, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { LoadingButton } from 'src/components/Button/LoadingButton';
import { Navbar } from 'src/components/Navbar';
import { useRoom } from 'src/contexts/RoomContext';
import { useLoader } from 'src/hooks/useLoader';

const CreatePage: FunctionComponent = () => {
  const { createAndJoinRoom } = useRoom();
  const { isLoading, load } = useLoader();
  const history = useHistory();
  const [promptSet, setPromptSet] = useState<PromptCategory>(
    PromptCategories[0]
  );

  const createLobby = async () => {
    const createdRoom = await load(() =>
      createAndJoinRoom({ promptPack: promptSet })
    );

    if (createdRoom.room) {
      history.push(`/curator/${createdRoom.roomCode}`);
    }
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
          <LoadingButton
            data-testid="createGame"
            loading={isLoading}
            alignSelf="center"
            label="Create Room"
            icon={<Add />}
            onClick={createLobby}
            size="large"
          />
        </Box>
      </Box>
    </Box>
  );
};

export { CreatePage };
