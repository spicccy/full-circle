import React, { FunctionComponent } from 'react';

import { Box, Nav, Header, Heading } from 'grommet';
import logo from 'src/images/fullcircle.png';
import { Link } from 'react-router-dom';

export const Navbar: FunctionComponent = () => (
  <Header background="light-2" pad="medium">
    <Box direction="row" align="center">
      <Link to="/create">
        <img alt="Full Circle" width={50} height={50} src={logo} />
      </Link>
      <Heading margin="none" level="3">
        Full Circle
      </Heading>
    </Box>

    <Nav direction="row">
      <Link to="/team">Meet the Team</Link>
      <Link to="/instructions">How to Play</Link>
      <Link to="/">Join a Game</Link>
    </Nav>
  </Header>
);
