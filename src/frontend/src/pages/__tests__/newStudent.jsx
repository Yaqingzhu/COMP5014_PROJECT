import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, act, screen, fireEvent } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';

import { students } from '../../mocks/students';
import { NewStudentPage } from '../newStudent';

describe('Student component', () => {
  afterEach(() => {
    fetchMock.resetMocks();
  });

  it('Shows an empty course', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <NewStudentPage />
        </MemoryRouter>
      );
    });

    expect(screen.getByText('New student')).toBeDefined();

    expect(screen.getByTestId('name').value).toBe('');
    expect(screen.getByTestId('email').value).toBe('');
  });

  it('Creates a student when saving', async () => {
    const newName = 'test';
    const newEmail = 'test@test.test';

    fetchMock.mockResponse(JSON.stringify({
      responseCode: 0,
      studentId: students[0].studentId,
    }));

    await act(async () => {
      render(
        <MemoryRouter>
          <NewStudentPage />
        </MemoryRouter>
      );
    });

    const nameInput = screen.getByTestId('name');
    const emailInput = screen.getByTestId('email');

    await act(async () => {
      fireEvent.change(nameInput, { target: { value: newName } });
      fireEvent.change(emailInput, { target: { value: newEmail } });
    });

    expect(nameInput.value).toBe(newName);
    expect(emailInput.value).toBe(newEmail);

    await act(async () => {
      fireEvent.click(screen.getByText('Save changes'));
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    const calls = fetchMock.mock.calls;

    expect(calls).toHaveLength(1);
    expect(calls[0][0]).toContain('/createstudent');
    expect(calls[0][1].body).toContain(`"studentName":"${newName}"`);
    expect(calls[0][1].body).toContain(`"studentEmail":"${newEmail}"`);
  });
});
