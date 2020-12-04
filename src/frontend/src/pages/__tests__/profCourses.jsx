import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, act, waitFor, screen, fireEvent } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';

import { ProfCoursesPage } from '../profCourses';
import { courses } from '../../mocks/courses';

describe('ProfCourses component', () => {
  const user = {
    loginId: '123',
  };

  afterEach(() => {
    fetchMock.resetMocks();
  });

  it('Shows the courses once loaded', async () => {
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      courses: JSON.stringify(courses),
    }));

    await act(async () => {
      render(
        <MemoryRouter>
          <ProfCoursesPage user={user} />
        </MemoryRouter>
      );
    });

    await waitFor(() => screen.getByText('My courses'));
    expect(screen.getByText('My courses')).toBeDefined();

    courses.forEach(course => {
      expect(screen.getByText(course.courseName)).toBeDefined();
    });
  });

  it('Shows a no courses messages if there are no courses loaded', async () => {
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      courses: '[]',
    }));

    await act(async () => {
      render(
        <MemoryRouter>
          <ProfCoursesPage user={user} />
        </MemoryRouter>
      );
    });

    await waitFor(() => screen.getByText('My courses'));
    expect(screen.getByRole('alert')).toBeDefined();
  });

  it('Shows a loader while the courses are loading', async () => {
    fetchMock.mockOnce(JSON.stringify({
      responseCode: -1,
    }));
    await act(async () => {
      render(
        <MemoryRouter>
          <ProfCoursesPage user={user} />
        </MemoryRouter>
      );
    });

    expect(screen.getByText('Loading...')).toBeDefined();
  });
});
