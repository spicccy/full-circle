import React, { FunctionComponent } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Grommet } from 'grommet';
import { theme } from './styles/theme';
import { RoomProvider } from './contexts/RoomContext';
import { LoginPage, MainPage, CreateRoomPage } from './pages';

import 'styled-components/macro';

export const App: FunctionComponent = () => {
  return (
    <RoomProvider>
      <Grommet theme={theme} full>
        <Switch>
          <Route exact path="/" component={LoginPage} />
          <Route exact path="/join" component={LoginPage} />
          <Route exact path="/create" component={CreateRoomPage} />
          <Route path="/play" component={MainPage} />
        </Switch>
      </Grommet>
    </RoomProvider>
  );
};
