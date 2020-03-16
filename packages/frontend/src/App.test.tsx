import React from 'react';
import { render } from '@testing-library/react';
import { App } from './App';

test('renders login page by default', () => {
  const { getByText } = render(<App />);
  const titleElement = getByText('Login');
  expect(titleElement).toBeInTheDocument();
});
