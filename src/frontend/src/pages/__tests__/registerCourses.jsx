import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, act, waitFor, screen, fireEvent } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';

import { RegisterCoursesPage } from '../registerCourses';
import { courses } from '../../mocks/courses';

describe('RegisterCoursesPage component', () => {
  const user = {
    loginId: '123',
  };

  afterEach(() => {
    fetchMock.resetMocks();
  });

  it('Shows the registerable courses once loaded', async () => {
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      courses: '[]',
    }));
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      coursePayload: courses.map(course => ({ result: JSON.stringify(course) })),
    }));

    act(() => {
      render(
        <MemoryRouter>
          <RegisterCoursesPage user={user} />
        </MemoryRouter>
      );
    });

    await waitFor(() => screen.getByText('Available courses'));
    expect(screen.getByText('Available courses')).toBeDefined();

    courses.filter(course => course.courseStatus === 'scheduled').forEach(course => {
      expect(screen.getByText(course.courseName)).toBeDefined();
    });
  });

  it('Shows a no courses messages if there are no courses loaded', async () => {
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      courses: '[]',
    }));
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      coursePayload: [],
    }));

    act(() => {
      render(
        <MemoryRouter>
          <RegisterCoursesPage user={user} />
        </MemoryRouter>
      );
    });

    await waitFor(() => screen.getByText('Available courses'));
    expect(screen.getByRole('alert')).toBeDefined();
  });

  it('Shows a no courses messages if the student has registered to all the courses', async () => {
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      courses: JSON.stringify(courses),
    }));
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      coursePayload: courses.map(course => ({ result: JSON.stringify(course) })),
    }));

    act(() => {
      render(
        <MemoryRouter>
          <RegisterCoursesPage user={user} />
        </MemoryRouter>
      );
    });

    await waitFor(() => screen.getByText('Available courses'));
    expect(screen.getByRole('alert')).toBeDefined();
  });

  it('Shows a loader while the courses are loading', () => {
    fetchMock.mockResponse(JSON.stringify({
      responseCode: -1,
    }));
    render(
      <MemoryRouter>
        <RegisterCoursesPage user={user} />
      </MemoryRouter>
    );

    expect(screen.getByText('Loading...')).toBeDefined();
  });

  it('Registers to a course when the button is clicked after selecting a course', async () => {
    const course = courses.find(course => course.courseStatus === 'scheduled');
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      courses: '[]',
    }));
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      coursePayload: courses.map(course => ({ result: JSON.stringify(course) })),
    }));
    fetchMock.mockOnce(JSON.stringify({}));

    act(() => {
      render(
        <MemoryRouter>
          <RegisterCoursesPage user={user} />
        </MemoryRouter>
      );
    });

    await waitFor(() => screen.getByText('Available courses'));

    act(() => {
      fireEvent.click(screen.getByTestId(`check-${course.courseId}`));
    });

    act(() => {
      fireEvent.click(screen.getByText('Register'));
    });

    const calls = fetchMock.mock.calls;

    expect(calls).toHaveLength(3);
    expect(calls[2][0]).toContain('/registercourse');
    expect(calls[2][1].body).toContain(`"courseId":${course.courseId}`);
  });
});
