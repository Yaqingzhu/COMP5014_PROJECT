import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, act, waitFor, screen, fireEvent } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';

import { RegisteredCoursesPage } from '../registeredCourses';
import { studentRegisteredCourses } from '../../mocks/students';

describe('RegisteredCoursesPage component', () => {
  const user = {
    loginId: '123',
  };

  afterEach(() => {
    fetchMock.resetMocks();
  });

  it('Shows the courses once loaded', async () => {
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      courses: JSON.stringify(studentRegisteredCourses),
    }));

    act(() => {
      render(
        <MemoryRouter>
          <RegisteredCoursesPage user={user} />
        </MemoryRouter>
      );
    });

    await waitFor(() => screen.getByText('My courses'));
    expect(screen.getByText('My courses')).toBeDefined();
    expect(screen.getByText('Dropped courses')).toBeDefined();

    studentRegisteredCourses.forEach(course => {
      expect(screen.getByText(course.courseName)).toBeDefined();
    });
  });

  it('Shows a no courses messages if there are no courses registered', async () => {
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      courses: JSON.stringify(studentRegisteredCourses.filter(course => course.dropDate !== null)),
    }));

    act(() => {
      render(
        <MemoryRouter>
          <RegisteredCoursesPage user={user} />
        </MemoryRouter>
      );
    });

    await waitFor(() => screen.getByText('My courses'));
    expect(screen.getByRole('alert')).toBeDefined();
  });

  it('Does not show the dropped table if there are no dropped courses', async () => {
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      courses: JSON.stringify(studentRegisteredCourses.filter(course => course.dropDate === null)),
    }));

    act(() => {
      render(
        <MemoryRouter>
          <RegisteredCoursesPage user={user} />
        </MemoryRouter>
      );
    });

    await waitFor(() => screen.getByText('My courses'));
    expect(screen.queryByTestId('dropped-courses')).toBe(null);
  });

  it('Shows a loader while the courses are loading', () => {
    fetchMock.mockOnce(JSON.stringify({
      responseCode: -1,
    }));
    render(
      <MemoryRouter>
        <RegisteredCoursesPage user={user} />
      </MemoryRouter>
    );

    expect(screen.getByText('Loading...')).toBeDefined();
  });

  it('Drops a course when the button is clicked', async () => {
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      courses: JSON.stringify(studentRegisteredCourses),
    }));
    fetchMock.mockOnce(JSON.stringify({}));

    act(() => {
      render(
        <MemoryRouter>
          <RegisteredCoursesPage user={user} />
        </MemoryRouter>
      );
    });

    await waitFor(() => screen.getByText('My courses'));

    act(() => {
      fireEvent.click(screen.getAllByText('Drop')[0]);
    });

    const calls = fetchMock.mock.calls;

    expect(calls).toHaveLength(2);
    expect(calls[1][0]).toContain('/dropcourse');
    expect(calls[1][1].body).toContain(`"courseId":${studentRegisteredCourses[0].courseId}`);
  });
});
