import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, act, waitFor, screen } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';

import { StudentCoursePage } from '../studentCourse';
import { courses } from '../../mocks/courses';
import { deliverables } from '../../mocks/deliverables';

describe('Course component', () => {
  const user = {
    loginId: '123',
  };

  afterEach(() => {
    fetchMock.resetMocks();
  });

  it('Shows the course once loaded', async () => {
    const course = courses[0];
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      course,
    }));
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      deliverables,
    }));

    await act(async () => {
      render(
        <MemoryRouter>
          <StudentCoursePage user={user} />
        </MemoryRouter>
      );
    });

    await waitFor(() => screen.getByText(course.courseName));
    expect(screen.getByText(course.courseName)).toBeDefined();

    deliverables.forEach(deliverable => {
      expect(screen.getByDisplayValue(deliverable.deliverableType)).toBeDefined();
    });
  });

  it('Shows a loader while the course is loading', async () => {
    fetchMock.mockOnce(JSON.stringify({
      responseCode: -1,
      course: null,
    }));
    fetchMock.mockOnce(JSON.stringify({
      responseCode: -1,
      deliverables: null,
    }));
    await act(async () => {
      render(
        <MemoryRouter>
          <StudentCoursePage user={user} />
        </MemoryRouter>
      );
    });

    expect(screen.getByText('Loading...')).toBeDefined();
  });
});
