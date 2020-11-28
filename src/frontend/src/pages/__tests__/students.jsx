import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, act, waitFor, screen, fireEvent } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';

import { StudentsPage } from '../students';
import { students } from '../../mocks/students';
import { useStudents } from '../../api/useStudents';
jest.mock('../../api/useStudents');

describe('Students component', () => {
  afterEach(() => {
    fetchMock.resetMocks();
    useStudents.mockReset();
  });

  it('Shows the students once loaded', async () => {
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      payload: students.map(student => ({ result: JSON.stringify(student) })),
    }));
    useStudents.mockReturnValue({
      loading: false,
      students,
    });

    act(() => {
      render(
        <MemoryRouter>
          <StudentsPage />
        </MemoryRouter>
      );
    });

    await waitFor(() => screen.getByText('Available students'));
    expect(screen.getByText('Available students')).toBeDefined();

    students.forEach(student => {
      expect(screen.getByText(student.studentName)).toBeDefined();
    });
  });

  it('Shows a no students messages if there are no students loaded', async () => {
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      payload: [],
    }));
    useStudents.mockReturnValue({
      loading: false,
      students: [],
    });

    act(() => {
      render(
        <MemoryRouter>
          <StudentsPage />
        </MemoryRouter>
      );
    });

    await waitFor(() => screen.getByText('Available students'));
    expect(screen.getByRole('alert')).toBeDefined();
  });

  it('Shows a loader while the students are loading', () => {
    fetchMock.mockOnce(JSON.stringify({
      responseCode: -1,
    }));
    useStudents.mockReturnValue({
      loading: true,
    });

    render(
      <MemoryRouter>
        <StudentsPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Loading...')).toBeDefined();
  });

  it('Deletes a student when the button is clicked', async () => {
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      payload: students.map(student => ({ result: JSON.stringify(student) })),
    }));
    fetchMock.mockOnce(JSON.stringify({}));
    useStudents.mockReturnValue({
      loading: false,
      students,
    });

    act(() => {
      render(
        <MemoryRouter>
          <StudentsPage />
        </MemoryRouter>
      );
    });

    await waitFor(() => screen.getByText('Available students'));

    act(() => {
      fireEvent.click(screen.getAllByText('Delete')[0]);
    });

    const calls = fetchMock.mock.calls;

    expect(calls).toHaveLength(1);
    expect(calls[0][0]).toContain('/deletestudent');
    expect(calls[0][1].body).toContain(`"studentId":${students[0].studentId}`);
  });
});
