import {
  Box,
  Button,
  Header,
  Heading,
  Layer,
  Nav,
  Paragraph,
  ResponsiveContext,
} from 'grommet';
import { Multiple } from 'grommet-icons';
import React, { FunctionComponent, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from 'src/images/fullcircle.png';

export const Navbar: FunctionComponent = () => {
  const size = React.useContext(ResponsiveContext);
  const [show, setShow] = useState(false);
  return (
    <Header background="light-2" pad="medium">
      <Box direction="row" align="center">
        <Link to="/home">
          <img alt="Full Circle" width={50} height={50} src={logo} />
        </Link>
        {size !== 'small' && (
          <Heading margin="none" level="3">
            Full Circle
          </Heading>
        )}
      </Box>
      {size === 'small' && (
        <Box align="start" justify="center">
          <Box>
            <Button
              icon={<Multiple />}
              label="show"
              onClick={() => setShow(true)}
            />
            {show && (
              <Layer
                onEsc={() => setShow(false)}
                onClickOutside={() => setShow(false)}
              >
                <Box background="light-2" fill>
                  <Box flex align="center" justify="center">
                    <Paragraph>
                      <Link to="/team">Meet the Team</Link>
                    </Paragraph>
                    <Paragraph>
                      <Link to="/instructions">How to Play</Link>
                    </Paragraph>
                    <Paragraph>
                      <Link to="/">Join a Game</Link>
                    </Paragraph>
                    <Button label="close" onClick={() => setShow(false)} />
                  </Box>
                </Box>
              </Layer>
            )}
          </Box>
        </Box>
      )}

      {size !== 'small' && (
        <Nav direction="row">
          <Link to="/team">Meet the Team</Link>
          <Link to="/instructions">How to Play</Link>
          <Link to="/">Join a Game</Link>
        </Nav>
      )}
    </Header>
  );
};
