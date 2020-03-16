import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { App } from './App';

test('renders login page by default', () => {
  const { getByText } = render(
    <Router>
      <App />
    </Router>
  );
  const titleElement = getByText('Login');
  expect(titleElement).toBeInTheDocument();
});
