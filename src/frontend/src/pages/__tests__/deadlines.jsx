import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, act, waitFor, screen, fireEvent } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';

import { DeadlinesPage } from '../deadlines';

describe('Deadlines component', () => {
  const deadlines = {
    registrationDeadline: new Date().toISOString(),
    dropDeadline: new Date().toISOString(),
  };

  afterEach(() => {
    fetchMock.resetMocks();
  });

  it('Shows the deadlines once loaded', async () => {
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      ...deadlines,
    }));

    await act(async () => {
      render(
        <MemoryRouter>
          <DeadlinesPage />
        </MemoryRouter>
      );
    });

    await waitFor(() => screen.getByText('Academic deadlines'));
    expect(screen.getByText('Academic deadlines')).toBeDefined();
  });

  it('Shows a loader while the deadlines are loading', async () => {
    fetchMock.mockOnce(JSON.stringify({
      responseCode: -1,
    }));
    await act(async () => {
      render(
        <MemoryRouter>
          <DeadlinesPage />
        </MemoryRouter>
      );
    });

    expect(screen.getByText('Loading...')).toBeDefined();
  });

  it('Update the deadlines when saving', async () => {
    fetchMock.mockResponse(JSON.stringify({
      responseCode: 0,
      ...deadlines,
    }));
    await act(async () => {
      render(
        <MemoryRouter>
          <DeadlinesPage />
        </MemoryRouter>
      );
    });

    await waitFor(() => screen.getByText('Academic deadlines'));
    expect(screen.getByText('Academic deadlines')).toBeDefined();

    await act(async () => {
      fireEvent.click(screen.getByText('Save changes'));
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    const calls = fetchMock.mock.calls;

    expect(calls).toHaveLength(3);
    expect(calls[1][0]).toContain('/updateacademicline');
  });
});
