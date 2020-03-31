import 'styled-components/macro';

import { Box, Button, Form, Heading, Image, Text, TextInput } from 'grommet';
import React, { FormEvent, FunctionComponent } from 'react';
import { Card } from 'src/components/Card/Card';
import logo from 'src/images/fullcircle.png';

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
    <Form onSubmit={handleSubmit}>
      <Card pad="large">
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
          <TextInput size="medium" id="roomId" name="roomId" maxLength={4} />
        </Box>
        <Button type="submit" size="large" alignSelf="center" label="JOIN" />
      </Card>
    </Form>
  );
};

export { LoginCard };
