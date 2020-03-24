import React, { FunctionComponent } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Grommet } from 'grommet';
import { theme } from './styles/theme';
import { RoomProvider } from './contexts/RoomContext';
import {
  LoginPage,
  GamePage,
  CreateRoomPage,
  Instructions,
  Team,
  TimerTest,
} from './pages';

import 'styled-components/macro';
import { DebugRoomState } from './pages/debug/timer/DebugRoomState';

export const App: FunctionComponent = () => {
  try {
    return (
      <RoomProvider>
        <DebugRoomState debug={true} />
        <Grommet theme={theme} full>
          <Switch>
            <Route exact path="/" component={LoginPage} />
            <Route exact path="/lobby" component={TimerTest} />
            <Route exact path="/join" component={LoginPage} />
            <Route exact path="/create" component={CreateRoomPage} />
            <Route exact path="/play" component={GamePage} />
            <Route exact path="/instructions" component={Instructions} />
            <Route exact path="/team" component={Team} />
            <Route path="/" component={LoginPage} />
          </Switch>
        </Grommet>
      </RoomProvider>
    );
  } catch (e) {
    console.error(e);
    return <Redirect to="/" />;
  }
};
