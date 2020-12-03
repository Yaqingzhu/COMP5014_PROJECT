import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, act, waitFor, screen, fireEvent } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';

import { ProfsPage } from '../profs';
import { profs } from '../../mocks/profs';

describe('Profs component', () => {
  afterEach(() => {
    fetchMock.resetMocks();
  });

  it('Shows the profs once loaded', async () => {
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      profs,
    }));

    act(() => {
      render(
        <MemoryRouter>
          <ProfsPage />
        </MemoryRouter>
      );
    });

    await waitFor(() => screen.getByText('Available profs'));
    expect(screen.getByText('Available profs')).toBeDefined();

    profs.forEach(prof => {
      expect(screen.getByText(prof.profName)).toBeDefined();
    });
  });

  it('Shows a no profs messages if there are no profs loaded', async () => {
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      profs: [],
    }));

    act(() => {
      render(
        <MemoryRouter>
          <ProfsPage />
        </MemoryRouter>
      );
    });

    await waitFor(() => screen.getByText('Available profs'));
    expect(screen.getByRole('alert')).toBeDefined();
  });

  it('Shows a loader while the profs are loading', () => {
    fetchMock.mockOnce(JSON.stringify({
      responseCode: -1,
    }));

    render(
      <MemoryRouter>
        <ProfsPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Loading...')).toBeDefined();
  });

  it('Deletes a prof when the button is clicked', async () => {
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      profs,
    }));
    fetchMock.mockOnce(JSON.stringify({}));

    act(() => {
      render(
        <MemoryRouter>
          <ProfsPage />
        </MemoryRouter>
      );
    });

    await waitFor(() => screen.getByText('Available profs'));

    act(() => {
      fireEvent.click(screen.getAllByText('Delete')[0]);
    });

    const calls = fetchMock.mock.calls;

    expect(calls).toHaveLength(2);
    expect(calls[1][0]).toContain('/deleteprof');
    expect(calls[1][1].body).toContain(`"profId":${profs[0].profId}`);
  });
});
