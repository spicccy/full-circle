import React, { FunctionComponent } from 'react';
import { Box, Heading, Button, Paragraph } from 'grommet';
import { Add, Previous } from 'grommet-icons';
import { useHistory } from 'react-router-dom';

import { useRoom } from 'src/contexts/RoomContext';

const CreateRoomPage: FunctionComponent = () => {
  const history = useHistory();
  const room = useRoom();

  return (
    <Box background="dark-1" fill>
      <Box flex align="center" justify="center">
        <Box width="medium">
          <Box background="light-1" pad="large">
            <Button
              as="a"
              alignSelf="start"
              label="Back"
              size="small"
              icon={<Previous size="small" />}
              onClick={() => history.push('/')}
            />
            <Heading>Create a Room</Heading>
            <Box align="center">
              <Paragraph>
                There are more features coming to this area. Players will be
                able to choose game rules and customise the number of
                rounds/players.
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
              onClick={async () => {
                await room.createAndJoinRoom();
                history.push('/play');
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export { CreateRoomPage };
