import { render, waitForDomChange } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Router } from 'react-router-dom';

import { App } from './App';

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

  it('should allow a player to go to the create room screen', async () => {
    const history = createMemoryHistory();
    history.push('/');
    const { getByText } = render(
      <Router history={history}>
        <App />
      </Router>
    );

    const createRoomButton = getByText('here');
    createRoomButton.click();

    await waitForDomChange();

    const titleElement = getByText('Room Settings');
    expect(titleElement).toBeInTheDocument();
  });
});
