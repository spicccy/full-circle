import React, { FunctionComponent, FormEvent } from 'react';
import {
  Box,
  Heading,
  Text,
  TextInput,
  Grommet,
  Image,
  Form,
  Button,
} from 'grommet';
import logo from 'src/images/fullcircle.png';
import { notepadTheme } from 'src/styles/notepadTheme';
import 'styled-components/macro';

const Header: FunctionComponent = () => (
  <Box direction="row" align="center" justify="center">
    <Image
      a11yTitle="Full Circle"
      width={100}
      height={100}
      margin={{ right: 'small' }}
      src={logo}
    />
    <Heading css={{ width: 'min-content' }} responsive={false}>
      Full Circle
    </Heading>
  </Box>
);

interface IFormValues {
  username: string;
  roomId: string;
}

interface ILoginCardProps {
  attemptToJoinRoom(name: string, roomId: string): void;
}

const LoginCard: FunctionComponent<ILoginCardProps> = ({
  attemptToJoinRoom,
}) => {
  const handleSubmit = (e: FormEvent) => {
    const formValues: IFormValues = (e as any).value;
    attemptToJoinRoom(formValues.username, formValues.roomId);
  };

  return (
    <Grommet theme={notepadTheme}>
      <Form onSubmit={handleSubmit}>
        <Box background="light-1" pad="large" elevation="large" round="small">
          <Header />
          <Box direction="row" align="center" margin={{ bottom: 'medium' }}>
            <Text size="xlarge" margin={{ right: 'small' }}>
              Name:
            </Text>
            <TextInput size="medium" name="username" id="username" />
          </Box>
          <Box direction="row" align="center" margin={{ bottom: 'medium' }}>
            <Text size="xlarge" margin={{ right: 'small' }}>
              Room:
            </Text>
            <TextInput size="medium" id="roomId" name="roomId" />
          </Box>
          <Button type="submit" size="large" alignSelf="center" label="JOIN" />
        </Box>
      </Form>
    </Grommet>
  );
};

export { LoginCard };
