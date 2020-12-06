import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, act, waitFor, screen, fireEvent } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';

import { ProfDeliverablePage } from '../profDeliverable';
import { deliverables } from '../../mocks/deliverables';
import { registrations } from '../../mocks/registrations';
import { submission } from '../../mocks/submission';

describe('Deliverable component', () => {
  const deliverable = deliverables[0];

  afterEach(() => {
    fetchMock.resetMocks();
  });

  it('Shows the course once loaded', async () => {
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      deliverable,
    }));
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      students: registrations,
    }));
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      submissions: [submission],
    }));

    await act(async () => {
      render(
        <MemoryRouter>
          <ProfDeliverablePage />
        </MemoryRouter>
      );
    });

    await waitFor(() => screen.getByText(`Student submissions for deliverable ${deliverable.deliverableId}`));
    expect(screen.getByText(`Student submissions for deliverable ${deliverable.deliverableId}`)).toBeDefined();

    registrations.forEach(student => {
      expect(screen.getByText(student.studentName)).toBeDefined();
      if (student.registrationId === submission.registrationId) {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(screen.getByTestId(`${student.studentId} _grade`)).toBeDefined();
        // eslint-disable-next-line jest/no-conditional-expect
        expect(screen.getByTestId(`${student.studentId} _grade`).value).toEqual(`${submission.submissionGrade}`);
      }
    });
  });

  it('Shows a loader while the courses are loading', async () => {
    fetchMock.mockOnce(JSON.stringify({
      responseCode: -1,
      deliverable: null,
    }));
    fetchMock.mockOnce(JSON.stringify({
      responseCode: -1,
      students: null,
    }));
    fetchMock.mockOnce(JSON.stringify({
      responseCode: -1,
      submissions: null,
    }));
    await act(async () => {
      render(
        <MemoryRouter>
          <ProfDeliverablePage />
        </MemoryRouter>
      );
    });

    expect(screen.getByText('Loading...')).toBeDefined();
  });

  it('Send a grade update when changing the value of an input', async () => {
    const newGrade = 100;

    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      deliverable,
    }));
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      students: registrations,
    }));
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      submissions: [submission],
    }));
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
    }));
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      submissions: [submission],
    }));

    await act(async () => {
      render(
        <MemoryRouter>
          <ProfDeliverablePage />
        </MemoryRouter>
      );
    });

    await waitFor(() => screen.getByText(`Student submissions for deliverable ${deliverable.deliverableId}`));

    const student = registrations.find(student => student.registrationId === submission.registrationId);
    const gradeInput = screen.getByTestId(`${student.studentId} _grade`);

    await act(async () => {
      fireEvent.blur(gradeInput, { target: { value: newGrade } });
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    const calls = fetchMock.mock.calls;

    expect(calls).toHaveLength(5);
    expect(calls[3][0]).toContain('/gradesubmission');
    expect(calls[3][1].body).toContain(`"submissionId":${submission.submissionId}`);
    expect(calls[3][1].body).toContain(`"grade":"${newGrade}"`);
  });
});
