import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, act, waitFor, screen, fireEvent } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';

import { ProfCoursePage } from '../profCourse';
import { courses } from '../../mocks/courses';
import { students } from '../../mocks/students';
import { deliverables } from '../../mocks/deliverables';

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
      deliverables,
    }));
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      students,
    }));

    await act(async () => {
      render(
        <MemoryRouter>
          <ProfCoursePage />
        </MemoryRouter>
      );
    });

    await waitFor(() => screen.getByText(course.courseName));
    expect(screen.getByText(course.courseName)).toBeDefined();

    deliverables.forEach(deliverable => {
      expect(screen.getByDisplayValue(deliverable.deliverableType)).toBeDefined();
    });

    students.forEach(student => {
      expect(screen.getByText(student.studentName)).toBeDefined();
    });
  });

  it('Shows a loader while the courses are loading', async () => {
    fetchMock.mockOnce(JSON.stringify({
      responseCode: -1,
      coursePayload: null,
    }));
    await act(async () => {
      render(
        <MemoryRouter>
          <ProfCoursePage />
        </MemoryRouter>
      );
    });

    expect(screen.getByText('Loading...')).toBeDefined();
  });

  it('Creates a new deadlines when using that form', async () => {
    const course = courses[0];
    const newType = 'test';

    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      coursePayload: JSON.stringify(course),
    }));
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      deliverables: [],
    }));
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      students,
    }));
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      coursePayload: JSON.stringify(course),
    }));
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      deliverables: [],
    }));
    await act(async () => {
      render(
        <MemoryRouter>
          <ProfCoursePage />
        </MemoryRouter>
      );
    });

    await waitFor(() => screen.getByText(course.courseName));
    expect(screen.getByText(course.courseName)).toBeDefined();

    const typeInput = screen.getByTestId('type');

    await act(async () => {
      fireEvent.change(typeInput, { target: { value: newType } });
    });

    expect(typeInput.value).toBe(newType);

    await act(async () => {
      fireEvent.click(screen.getByText('Save changes'));
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    const calls = fetchMock.mock.calls;

    expect(calls).toHaveLength(5);
    expect(calls[3][0]).toContain('/createdeliverable');
    expect(calls[3][1].body).toContain(`"deliverableType":"${newType}"`);
  });

  it('Modifies a deadlines when using that form', async () => {
    const course = courses[0];
    const newType = 'test';

    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      coursePayload: JSON.stringify(course),
    }));
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      deliverables,
    }));
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      students,
    }));
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      coursePayload: JSON.stringify(course),
    }));
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      deliverables,
    }));
    await act(async () => {
      render(
        <MemoryRouter>
          <ProfCoursePage />
        </MemoryRouter>
      );
    });

    await waitFor(() => screen.getByText(course.courseName));
    expect(screen.getByText(course.courseName)).toBeDefined();

    const typeInput = screen.getAllByTestId('type')[0];

    await act(async () => {
      fireEvent.change(typeInput, { target: { value: newType } });
    });

    expect(typeInput.value).toBe(newType);

    await act(async () => {
      fireEvent.click(screen.getAllByText('Save changes')[0]);
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    const calls = fetchMock.mock.calls;

    expect(calls).toHaveLength(5);
    expect(calls[3][0]).toContain('/modifydeliverable');
    expect(calls[3][1].body).toContain(`"deliverableType":"${newType}"`);
  });

  it('Deletes a deadlines when using the link', async () => {
    const course = courses[0];

    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      coursePayload: JSON.stringify(course),
    }));
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      deliverables,
    }));
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      students,
    }));
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      coursePayload: JSON.stringify(course),
    }));
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      deliverables,
    }));
    await act(async () => {
      render(
        <MemoryRouter>
          <ProfCoursePage />
        </MemoryRouter>
      );
    });

    await waitFor(() => screen.getByText(course.courseName));
    expect(screen.getByText(course.courseName)).toBeDefined();

    await act(async () => {
      fireEvent.click(screen.getAllByText('Delete')[0]);
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    const calls = fetchMock.mock.calls;

    expect(calls).toHaveLength(5);
    expect(calls[3][0]).toContain('/deletedeliverable');
  });

  it('Submits the final grades when the button is clicked', async () => {
    const course = courses[0];

    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      coursePayload: JSON.stringify(course),
    }));
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      deliverables,
    }));
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      students,
    }));
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
    }));
    await act(async () => {
      render(
        <MemoryRouter>
          <ProfCoursePage />
        </MemoryRouter>
      );
    });

    await waitFor(() => screen.getByText(course.courseName));
    expect(screen.getByText(course.courseName)).toBeDefined();

    await act(async () => {
      fireEvent.click(screen.getByText('Submit final grades'));
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    const calls = fetchMock.mock.calls;

    expect(calls).toHaveLength(4);
    expect(calls[3][0]).toContain('/submitfinalgrade');
    expect(calls[3][1].body).toContain(`"courseId":${course.courseId}`);
  });
});
