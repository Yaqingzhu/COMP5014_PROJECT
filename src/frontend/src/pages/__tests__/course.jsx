import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, act, waitFor, screen, fireEvent } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';

import { CoursePage } from '../course';
import { courses } from '../../mocks/courses';
import { useCourse } from '../../api/useCourse';
jest.mock('../../api/useCourse');

describe('Course component', () => {
  afterEach(() => {
    useCourse.mockReset();
    fetchMock.resetMocks();
  });

  it('Shows the course once loaded', async () => {
    const course = courses[0];
    useCourse.mockReturnValue({
      loading: false,
      course,
    });
    act(() => {
      render(
        <MemoryRouter>
          <CoursePage />
        </MemoryRouter>
      );
    });

    await waitFor(() => screen.getByText(course.name));
    expect(screen.getByText(course.name)).toBeDefined();

    expect(screen.getByDisplayValue(course.name)).toBeDefined();
    expect(screen.getByDisplayValue(course.status)).toBeDefined();
    expect(screen.getByTestId('capacity')).toBeDefined();
  });

  it('Shows a loader while the courses are loading', () => {
    useCourse.mockReturnValue({
      loading: true,
    });
    act(() => {
      render(
        <MemoryRouter>
          <CoursePage />
        </MemoryRouter>
      );
    });

    expect(screen.getByText('Loading...')).toBeDefined();
  });

  it('Update a course when saving', async () => {
    const course = courses[0];
    const newName = 'test';
    const newStatus = 'test';
    const newCapacity = 10;
    useCourse.mockReturnValue({
      loading: false,
      course,
    });
    act(() => {
      render(
        <MemoryRouter>
          <CoursePage />
        </MemoryRouter>
      );
    });

    await waitFor(() => screen.getByText(course.name));
    expect(screen.getByText(course.name)).toBeDefined();

    const nameInput = screen.getByDisplayValue(course.name);
    const statusInput = screen.getByDisplayValue(course.status);
    const capacityInput = screen.getByTestId('capacity');

    act(() => {
      fireEvent.change(nameInput, { target: { value: newName } });
      fireEvent.change(statusInput, { target: { value: newStatus } });
      fireEvent.change(capacityInput, { target: { value: newCapacity } });
    });

    expect(nameInput.value).toBe(newName);
    expect(statusInput.value).toBe(newStatus);
    expect(capacityInput.value).toBe(`${newCapacity}`);

    act(() => {
      fireEvent.click(screen.getByText('Save changes'));
    });

    // TODO: Validate the API was called
  });
});
