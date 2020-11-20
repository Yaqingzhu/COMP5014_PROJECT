import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, act, waitFor, screen } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';

import { CoursesPage } from '../courses';
import { courses } from '../../mocks/courses';
import { useCourses } from '../../api/useCourses';
jest.mock('../../api/useCourses');

describe('Courses component', () => {
  afterEach(() => {
    useCourses.mockReset();
    fetchMock.resetMocks();
  });

  it('Shows the courses once loaded', async () => {
    useCourses.mockReturnValue({
      loading: false,
      courses,
    });
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
      expect(screen.getByText(course.name)).toBeDefined();
    });
  });

  it('Shows a no courses messages if there are no courses loaded', async () => {
    useCourses.mockReturnValue({
      loading: false,
      courses: [],
    });

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
    useCourses.mockReturnValue({
      loading: true,
    });
    render(
      <MemoryRouter>
        <CoursesPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Loading...')).toBeDefined();
  });

  // TODO: add deletion test when we use the API
});
