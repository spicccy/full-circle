import { Colour } from '@full-circle/shared/lib/canvas';
import { Box, Button, Heading, Paragraph } from 'grommet';
import { Car, Home } from 'grommet-icons';
import React, { FunctionComponent, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Card } from 'src/components/Card/Card';
import { LinkButton } from 'src/components/Link/LinkButton';

import TaxiImage from './Taxi';

const Error404: FunctionComponent = () => {
  const [triggerTaxi, setTriggerTaxi] = useState(false);

  const history = useHistory();

  if (triggerTaxi) {
    setTimeout(() => {
      history.replace('/');
    }, 2000);
    return (
      <Box
        background="dark-1"
        flex
        height={{ min: '100vh' }}
        align="center"
        justify="center"
        pad="medium"
      >
        <TaxiImage duration="1.5s"></TaxiImage>
      </Box>
    );
  }

  return (
    <Box
      background="dark-1"
      flex
      height={{ min: '100vh' }}
      align="center"
      justify="center"
      pad="medium"
    >
      <Card border={{ color: 'red', size: 'medium' }} pad="large">
        <Heading>404 Not Found</Heading>
        <Paragraph size="medium">Go Home, You're Drunk</Paragraph>
        <LinkButton
          size="large"
          margin="small"
          href="/"
          icon={<Home />}
          label="Go Home"
        />
        <Button
          color={Colour.ORANGE}
          onClick={() => {
            setTriggerTaxi(true);
          }}
          size="large"
          icon={<Car />}
          label="Catch a taxi home"
        />
      </Card>
    </Box>
  );
};

export { Error404 };
