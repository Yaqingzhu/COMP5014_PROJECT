import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, act, waitFor, screen, fireEvent } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';

import { StudentPage } from '../student';
import { students } from '../../mocks/students';
import { useStudent } from '../../api/useStudent';
jest.mock('../../api/useStudent');

describe('Student component', () => {
  afterEach(() => {
    fetchMock.resetMocks();
    useStudent.mockReset();
  });

  it('Shows the student once loaded', async () => {
    const student = students[0];
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      payload: JSON.stringify(student),
    }));
    useStudent.mockReturnValue({
      loading: false,
      student,
    });

    act(() => {
      render(
        <MemoryRouter>
          <StudentPage />
        </MemoryRouter>
      );
    });

    await waitFor(() => screen.getByText(student.studentName));
    expect(screen.getByText(student.studentName)).toBeDefined();

    expect(screen.getByDisplayValue(student.studentName)).toBeDefined();
    expect(screen.getByTestId('email')).toBeDefined();
    expect(screen.getByTestId('admitted')).toBeDefined();
  });

  it('Shows a loader while the student is loading', () => {
    fetchMock.mockOnce(JSON.stringify({
      responseCode: -1,
      coursePayload: null,
    }));
    useStudent.mockReturnValue({
      loading: true,
    });

    act(() => {
      render(
        <MemoryRouter>
          <StudentPage />
        </MemoryRouter>
      );
    });

    expect(screen.getByText('Loading...')).toBeDefined();
  });

  it('Update a student when saving', async () => {
    const student = students[0];
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      payload: JSON.stringify(student),
    }));
    useStudent.mockReturnValue({
      loading: false,
      student,
      reload: jest.fn(),
    });

    const newName = 'test';
    const newEmail = 'test@test.test';

    act(() => {
      render(
        <MemoryRouter>
          <StudentPage />
        </MemoryRouter>
      );
    });

    await waitFor(() => screen.getByText(student.studentName));
    expect(screen.getByText(student.studentName)).toBeDefined();

    const nameInput = screen.getByTestId('name');
    const emailInput = screen.getByTestId('email');

    act(() => {
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
    expect(calls[0][0]).toContain('/editstudent');
    expect(calls[0][1].body).toContain(`"studentName":"${newName}"`);
    expect(calls[0][1].body).toContain(`"studentEmail":"${newEmail}"`);
  });
});
