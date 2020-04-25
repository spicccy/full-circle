import 'styled-components/macro';

import { Colour } from '@full-circle/shared/lib/canvas';
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
import { Menu } from 'grommet-icons';
import React, { FunctionComponent, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from 'src/images/fullcircle.png';
import styled from 'styled-components';

const NavLink = styled(Link)`
  text-decoration: none;
  color: ${Colour.DARK_GRAY};
  :hover {
    color: ${Colour.BLACK};
  }
`;

export const Navbar: FunctionComponent = () => {
  const size = React.useContext(ResponsiveContext);
  const [show, setShow] = useState(false);

  return (
    <Header background="white" pad="medium">
      <Box direction="row" align="center">
        <NavLink to="/">
          <img alt="Full Circle" width={50} height={50} src={logo} />
        </NavLink>
        {size !== 'small' && (
          <Heading margin="none" level="3">
            Full Circle
          </Heading>
        )}
      </Box>
      {size === 'small' && (
        <Box align="start" justify="center">
          <Box>
            <Button icon={<Menu />} onClick={() => setShow(true)} />
            {show && (
              <Layer
                onEsc={() => setShow(false)}
                onClickOutside={() => setShow(false)}
              >
                <Box background="light-2" fill>
                  <Box flex align="center" justify="center">
                    <Paragraph>
                      <NavLink to="/team">Meet the Team</NavLink>
                    </Paragraph>
                    <Paragraph>
                      <NavLink to="/instructions">How to Play</NavLink>
                    </Paragraph>
                    <Paragraph>
                      <NavLink
                        css={{
                          fontWeight: 'bold',
                          '&:hover': { color: Colour.ORANGE },
                        }}
                        to="/"
                      >
                        Join a Game
                      </NavLink>
                    </Paragraph>
                    <Button label="Close" onClick={() => setShow(false)} />
                  </Box>
                </Box>
              </Layer>
            )}
          </Box>
        </Box>
      )}

      {size !== 'small' && (
        <Nav direction="row">
          <NavLink to="/team">Meet the Team</NavLink>
          <NavLink to="/instructions">How to Play</NavLink>
          <NavLink
            css={{ fontWeight: 'bold', '&:hover': { color: Colour.ORANGE } }}
            to="/"
          >
            Join a Game
          </NavLink>
        </Nav>
      )}
    </Header>
  );
};
