import React from 'react';
import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { App } from './App';
import { Router } from 'react-router-dom';

describe('The App renders routes correctly', () => {
  it('should render the login page by default', () => {
    const history = createMemoryHistory();
    history.push('/');
    const { getByText } = render(
      <Router history={history}>
        <App />
      </Router>
    );
    const titleElement = getByText('Full Circle');
    expect(titleElement).toBeInTheDocument();
  });

  it('should allow a player to go to the create room screen', () => {
    const history = createMemoryHistory();
    history.push('/');
    const { getByText } = render(
      <Router history={history}>
        <App />
      </Router>
    );

    const createRoomButton = getByText('here');
    createRoomButton.click();

    const titleElement = getByText('Create a Room');
    expect(titleElement).toBeInTheDocument();
  });

  it('should redirect players without a room to the login page', () => {
    const history = createMemoryHistory();
    history.push('/play');
    const { getByText } = render(
      <Router history={history}>
        <App />
      </Router>
    );

    const titleElement = getByText('Full Circle');
    expect(titleElement).toBeInTheDocument();
  });
});
