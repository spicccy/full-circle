import 'styled-components/macro';

import { Grommet } from 'grommet';
import React, { FunctionComponent } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';

import { RoomProvider } from './contexts/RoomContext';
import {
  CreatePage,
  CuratorGamePage,
  Error404,
  Instructions,
  LoginPage,
  PlayerGamePage,
  Team,
} from './pages';
import { IngameReveal } from './pages/curator/IngamePages/IngameReveal';
import { DebugRoomState } from './pages/debug/timer/DebugRoomState';
import { theme } from './styles/theme';

export const App: FunctionComponent = () => {
  try {
    return (
      <RoomProvider>
        <DebugRoomState
          debug={!(process.env.REACT_APP_HIDE_DEBUG === 'hide')}
        />
        <Grommet theme={theme} full>
          <ToastProvider autoDismiss autoDismissTimeout={2500}>
            <Switch>
              <Route exact path="/" component={LoginPage} />
              <Route exact path="/join" component={LoginPage} />
              <Route exact path="/join/:roomCode" component={LoginPage} />
              <Route exact path="/create" component={CreatePage} />
              <Route exact path="/play" component={PlayerGamePage} />
              <Route exact path="/curator" component={CuratorGamePage} />
              <Route exact path="/instructions" component={Instructions} />
              <Route exact path="/team" component={Team} />
              <Route exact path="/revealtest" component={IngameReveal} />
              <Route path="/" component={Error404} />
            </Switch>
          </ToastProvider>
        </Grommet>
      </RoomProvider>
    );
  } catch (e) {
    console.error(e);
    return <Redirect to="/" />;
  }
};
