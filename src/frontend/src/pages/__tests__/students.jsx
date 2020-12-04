import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, act, waitFor, screen, fireEvent } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';

import { StudentsPage } from '../students';
import { students } from '../../mocks/students';

describe('Students component', () => {
  afterEach(() => {
    fetchMock.resetMocks();
  });

  it('Shows the students once loaded', async () => {
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      students,
    }));

    await act(async () => {
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
      students: [],
    }));

    await act(async () => {
      render(
        <MemoryRouter>
          <StudentsPage />
        </MemoryRouter>
      );
    });

    await waitFor(() => screen.getByText('Available students'));
    expect(screen.getByRole('alert')).toBeDefined();
  });

  it('Shows a loader while the students are loading', async () => {
    fetchMock.mockOnce(JSON.stringify({
      responseCode: -1,
    }));

    await act(async () => {
      render(
        <MemoryRouter>
          <StudentsPage />
        </MemoryRouter>
      );
    });

    expect(screen.getByText('Loading...')).toBeDefined();
  });

  it('Deletes a student when the button is clicked', async () => {
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      students,
    }));
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
    }));
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      students,
    }));

    await act(async () => {
      render(
        <MemoryRouter>
          <StudentsPage />
        </MemoryRouter>
      );
    });

    await waitFor(() => screen.getByText('Available students'));

    await act(async () => {
      fireEvent.click(screen.getAllByText('Delete')[0]);
    });

    const calls = fetchMock.mock.calls;

    expect(calls).toHaveLength(3);
    expect(calls[1][0]).toContain('/deletestudent');
    expect(calls[1][1].body).toContain(`"studentId":${students[0].studentId}`);
  });
});
