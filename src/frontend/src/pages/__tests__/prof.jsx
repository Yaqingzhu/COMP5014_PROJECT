import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, act, waitFor, screen, fireEvent } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';

import { ProfPage } from '../prof';
import { profs } from '../../mocks/profs';

describe('Prof component', () => {
  afterEach(() => {
    fetchMock.resetMocks();
  });

  it('Shows the prof once loaded', async () => {
    const prof = profs[0];
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      prof,
    }));

    await act(async () => {
      render(
        <MemoryRouter>
          <ProfPage />
        </MemoryRouter>
      );
    });

    await waitFor(() => screen.getByText(prof.profName));
    expect(screen.getByText(prof.profName)).toBeDefined();

    expect(screen.getByDisplayValue(prof.profName)).toBeDefined();
  });

  it('Shows a loader while the prof is loading', async () => {
    fetchMock.mockOnce(JSON.stringify({
      responseCode: -1,
      student: null,
    }));

    await act(async () => {
      render(
        <MemoryRouter>
          <ProfPage />
        </MemoryRouter>
      );
    });

    expect(screen.getByText('Loading...')).toBeDefined();
  });

  it('Update a prof when saving', async () => {
    const prof = profs[0];
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      prof,
    }));
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      profId: prof.profId,
    }));

    const newName = 'test';

    await act(async () => {
      render(
        <MemoryRouter>
          <ProfPage />
        </MemoryRouter>
      );
    });

    await waitFor(() => screen.getByText(prof.profName));
    expect(screen.getByText(prof.profName)).toBeDefined();

    const nameInput = screen.getByTestId('name');

    await act(async () => {
      fireEvent.change(nameInput, { target: { value: newName } });
    });

    expect(nameInput.value).toBe(newName);

    await act(async () => {
      fireEvent.click(screen.getByText('Save changes'));
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    const calls = fetchMock.mock.calls;

    expect(calls).toHaveLength(3);
    expect(calls[1][0]).toContain('/modifyprof');
    expect(calls[1][1].body).toContain(`"profName":"${newName}"`);
  });
});
