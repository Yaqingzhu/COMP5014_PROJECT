import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, act, screen, fireEvent } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';

import { profs } from '../../mocks/profs';
import { NewProfPage } from '../newProf';

describe('Prof component', () => {
  afterEach(() => {
    fetchMock.resetMocks();
  });

  it('Shows an empty prof', () => {
    act(() => {
      render(
        <MemoryRouter>
          <NewProfPage />
        </MemoryRouter>
      );
    });

    expect(screen.getByText('New prof')).toBeDefined();

    expect(screen.getByTestId('name').value).toBe('');
  });

  it('Creates a prof when saving', async () => {
    const newName = 'test';

    fetchMock.mockResponse(JSON.stringify({
      responseCode: 0,
      profId: profs[0].profId,
    }));

    act(() => {
      render(
        <MemoryRouter>
          <NewProfPage />
        </MemoryRouter>
      );
    });

    const nameInput = screen.getByTestId('name');

    act(() => {
      fireEvent.change(nameInput, { target: { value: newName } });
    });

    expect(nameInput.value).toBe(newName);

    await act(async () => {
      fireEvent.click(screen.getByText('Save changes'));
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    const calls = fetchMock.mock.calls;

    expect(calls).toHaveLength(1);
    expect(calls[0][0]).toContain('/createprof');
    expect(calls[0][1].body).toContain(`"profName":"${newName}"`);
  });
});
