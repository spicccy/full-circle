import React, { FunctionComponent } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Grommet } from 'grommet';
import { theme } from './styles/theme';
import { RoomProvider } from './contexts/RoomContext';
import { LoginPage } from './pages/LoginPage';
import { MainPage } from './pages/MainPage';

import 'styled-components/macro';

export const App: FunctionComponent = () => {
  return (
    <Router>
      <RoomProvider>
        <Grommet theme={theme} full>
          <Switch>
            <Route exact path="/" component={LoginPage} />
            <Route exact path="/join" component={LoginPage} />
            <Route path="/play" component={MainPage} />
          </Switch>
        </Grommet>
      </RoomProvider>
    </Router>
  );
};
