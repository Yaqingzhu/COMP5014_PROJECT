import * as React from 'react';
import { render, act, screen, waitFor } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';

import { App } from '../App';

describe('App component', () => {
  afterEach(() => {
    fetchMock.resetMocks();
  });

  it('Renders a Hello world from the API', async () => {
    const message = 'Hello, World!';
    fetchMock.mockOnce(message);

    act(() => {
      render(<App />);
    });

    await waitFor(() => screen.getByText(message));
    expect(screen.getByText(message)).toBeDefined();
  });
});
