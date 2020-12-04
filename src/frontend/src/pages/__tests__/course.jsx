import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, act, waitFor, screen, fireEvent } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';

import { CoursePage } from '../course';
import { courses } from '../../mocks/courses';
import { profs } from '../../mocks/profs';

describe('Course component', () => {
  afterEach(() => {
    fetchMock.resetMocks();
  });

  it('Shows the course once loaded', async () => {
    const course = courses[0];
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      coursePayload: JSON.stringify(course),
    }));
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      profs,
    }));

    await act(async () => {
      render(
        <MemoryRouter>
          <CoursePage />
        </MemoryRouter>
      );
    });

    await waitFor(() => screen.getByText(course.courseName));
    expect(screen.getByText(course.courseName)).toBeDefined();

    expect(screen.getByDisplayValue(course.courseName)).toBeDefined();
    expect(screen.getByTestId('status')).toBeDefined();
    expect(screen.getByTestId('capacity')).toBeDefined();
  });

  it('Shows a loader while the courses are loading', async () => {
    fetchMock.mockOnce(JSON.stringify({
      responseCode: -1,
      coursePayload: null,
    }));
    await act(async () => {
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
    const newStatus = 'unscheduled';
    const newCapacity = 10;

    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      coursePayload: JSON.stringify(course),
    }));
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      profs,
    }));
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      coursePayload: JSON.stringify(course),
    }));
    await act(async () => {
      render(
        <MemoryRouter>
          <CoursePage />
        </MemoryRouter>
      );
    });

    await waitFor(() => screen.getByText(course.courseName));
    expect(screen.getByText(course.courseName)).toBeDefined();

    const nameInput = screen.getByDisplayValue(course.courseName);
    const statusInput = screen.getByTestId('status');
    const capacityInput = screen.getByTestId('capacity');

    await act(async () => {
      fireEvent.change(nameInput, { target: { value: newName } });
      fireEvent.change(statusInput, { target: { value: newStatus } });
      fireEvent.change(capacityInput, { target: { value: newCapacity } });
    });

    expect(nameInput.value).toBe(newName);
    expect(statusInput.value).toBe(newStatus);
    expect(capacityInput.value).toBe(`${newCapacity}`);

    await act(async () => {
      fireEvent.click(screen.getByText('Save changes'));
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    const calls = fetchMock.mock.calls;

    expect(calls).toHaveLength(4);
    expect(calls[2][0]).toContain('/courseop');
    expect(calls[2][1].body).toContain(`"courseName":"${newName}"`);
    expect(calls[2][1].body).toContain(`"courseStatus":"${newStatus}"`);
    expect(calls[2][1].body).toContain(`"courseCapacity":"${newCapacity}"`);
  });
});
