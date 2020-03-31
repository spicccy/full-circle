import 'styled-components/macro';

import { Grommet } from 'grommet';
import React, { FunctionComponent } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { RoomProvider } from './contexts/RoomContext';
import {
  CuratorGamePage,
  HomePage,
  Instructions,
  LoginPage,
  PlayerGamePage,
  Team,
} from './pages';
import { DebugRoomState } from './pages/debug/timer/DebugRoomState';
import { theme } from './styles/theme';

export const App: FunctionComponent = () => {
  try {
    return (
      <RoomProvider>
        <DebugRoomState debug={true} />
        <Grommet theme={theme} full>
          <Switch>
            <Route exact path="/" component={LoginPage} />
            <Route exact path="/join" component={LoginPage} />
            <Route exact path="/home" component={HomePage} />
            <Route exact path="/play" component={PlayerGamePage} />
            <Route exact path="/game" component={CuratorGamePage} />
            <Route exact path="/instructions" component={Instructions} />
            <Route exact path="/team" component={Team} />
          </Switch>
        </Grommet>
      </RoomProvider>
    );
  } catch (e) {
    console.error(e);
    return <Redirect to="/" />;
  }
};
