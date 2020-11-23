import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, act, screen, fireEvent } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';

import { courses } from '../../mocks/courses';
import { NewCoursePage } from '../newCourse';

describe('Course component', () => {
  afterEach(() => {
    fetchMock.resetMocks();
  });

  it('Shows an empty course', () => {
    act(() => {
      render(
        <MemoryRouter>
          <NewCoursePage />
        </MemoryRouter>
      );
    });

    expect(screen.getByText('New course')).toBeDefined();

    expect(screen.getByTestId('name').value).toBe('');
    expect(screen.getByTestId('status').value).toBe('open');
    expect(screen.getByTestId('capacity').value).toBe('');
  });

  it('Created a course when saving', async () => {
    const newName = 'test';
    const newStatus = 'closed';
    const newCapacity = 10;

    fetchMock.mockResponse(JSON.stringify({
      responseCode: 0,
      coursePayload: JSON.stringify(courses[0]),
    }));
    act(() => {
      render(
        <MemoryRouter>
          <NewCoursePage />
        </MemoryRouter>
      );
    });

    const nameInput = screen.getByTestId('name');
    const statusInput = screen.getByTestId('status');
    const capacityInput = screen.getByTestId('capacity');

    act(() => {
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

    expect(calls).toHaveLength(1);
    expect(calls[0][0]).toContain('/courseop');
    expect(calls[0][1].body).toContain(`"courseName":"${newName}"`);
    expect(calls[0][1].body).toContain(`"courseStatus":"${newStatus}"`);
    expect(calls[0][1].body).toContain(`"courseCapacity":"${newCapacity}"`);
  });
});
