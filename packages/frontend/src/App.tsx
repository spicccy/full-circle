import React, { FunctionComponent } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Grommet } from 'grommet';
import { theme } from './styles/theme';
import { RoomProvider } from './contexts/RoomContext';
import {
  LoginPage,
  CuratorGamePage,
  Instructions,
  Team,
  HomePage,
  TimerTest,
  PlayerGamePage,
} from './pages';

import 'styled-components/macro';
import { DebugRoomState } from './pages/debug/timer/DebugRoomState';

export const App: FunctionComponent = () => {
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
          <Route exact path="/timertest" component={TimerTest} />
        </Switch>
      </Grommet>
    </RoomProvider>
  );
};
