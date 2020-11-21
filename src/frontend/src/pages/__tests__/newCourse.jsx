import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, act, screen, fireEvent } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';

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
    expect(screen.getByTestId('status').value).toBe('');
    expect(screen.getByTestId('capacity').value).toBe('');
  });

  it('Created a course when saving', () => {
    const newName = 'test';
    const newStatus = 'test';
    const newCapacity = 10;
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

    act(() => {
      fireEvent.click(screen.getByText('Save changes'));
    });

    // TODO: Validate the API was called
  });
});
