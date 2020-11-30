import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, act, waitFor, screen, fireEvent } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';

import { CoursesPage } from '../courses';
import { courses } from '../../mocks/courses';

describe('Courses component', () => {
  afterEach(() => {
    fetchMock.resetMocks();
  });

  it('Shows the courses once loaded', async () => {
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      coursePayload: courses.map(course => ({ result: JSON.stringify(course) })),
    }));

    act(() => {
      render(
        <MemoryRouter>
          <CoursesPage />
        </MemoryRouter>
      );
    });

    await waitFor(() => screen.getByText('Available courses'));
    expect(screen.getByText('Available courses')).toBeDefined();

    courses.forEach(course => {
      expect(screen.getByText(course.courseName)).toBeDefined();
    });
  });

  it('Shows a no courses messages if there are no courses loaded', async () => {
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      coursePayload: [],
    }));

    act(() => {
      render(
        <MemoryRouter>
          <CoursesPage />
        </MemoryRouter>
      );
    });

    await waitFor(() => screen.getByText('Available courses'));
    expect(screen.getByRole('alert')).toBeDefined();
  });

  it('Shows a loader while the courses are loading', () => {
    fetchMock.mockOnce(JSON.stringify({
      responseCode: -1,
    }));
    render(
      <MemoryRouter>
        <CoursesPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Loading...')).toBeDefined();
  });

  it('Cancels a course when the button is clicked', async () => {
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      coursePayload: courses.map(course => ({ result: JSON.stringify(course) })),
    }));
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
    }));

    act(() => {
      render(
        <MemoryRouter>
          <CoursesPage />
        </MemoryRouter>
      );
    });

    await waitFor(() => screen.getByText('Available courses'));

    act(() => {
      fireEvent.click(screen.getAllByText('Cancel')[0]);
    });

    const calls = fetchMock.mock.calls;

    expect(calls).toHaveLength(2);
    expect(calls[1][0]).toContain('/cancelcourse');
    expect(calls[1][1].body).toContain(`"courseId":${courses[0].courseId}`);
  });

  it('Deletes a course when the button is clicked', async () => {
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      coursePayload: courses.map(course => ({ result: JSON.stringify(course) })),
    }));
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
    }));

    act(() => {
      render(
        <MemoryRouter>
          <CoursesPage />
        </MemoryRouter>
      );
    });

    await waitFor(() => screen.getByText('Available courses'));

    act(() => {
      fireEvent.click(screen.getAllByText('Delete')[0]);
    });

    const calls = fetchMock.mock.calls;

    expect(calls).toHaveLength(2);
    expect(calls[1][0]).toContain('/courseop');
    expect(calls[1][1].body).toContain('"courseStatus":"deleted"');
  });
});
