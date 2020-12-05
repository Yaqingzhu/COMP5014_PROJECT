import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, act, waitFor, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import fetchMock from 'jest-fetch-mock';
import moment from 'moment';

import { StudentDeliverablePage } from '../studentDeliverable';
import { registrations } from '../../mocks/registrations';
import { deliverables } from '../../mocks/deliverables';
import { submission } from '../../mocks/submission';
import { courses } from '../../mocks/courses';
import { profs } from '../../mocks/profs';
import { CoursePage } from '../course';

describe('Deliverable component', () => {
  const user = {
    loginId: '123',
  };
  const registration = registrations[0];
  const deliverable = deliverables[0];

  afterEach(() => {
    fetchMock.resetMocks();
  });

  it('Shows the deliverable once loaded', async () => {
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      course: registration,
    }));
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      deliverable,
    }));
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      submission,
    }));

    await act(async () => {
      render(
        <MemoryRouter>
          <StudentDeliverablePage user={user} />
        </MemoryRouter>
      );
    });

    await waitFor(() => screen.getByText('Edit your submission'));
    expect(screen.getByText('Edit your submission')).toBeDefined();

    expect(screen.getByTestId('due-date')).toHaveTextContent(
      moment(deliverable.deliverableDeadline).format('MMMM Do YYYY, h:mm:ss a')
    );
    expect(screen.getByTestId('submission-date')).toHaveTextContent(
      moment(submission.submissionDate).format('MMMM Do YYYY, h:mm:ss a')
    );
  });

  it('Doesn\'t show the submission if it is null', async () => {
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      course: registration,
    }));
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      deliverable,
    }));
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      submission: null,
    }));

    await act(async () => {
      render(
        <MemoryRouter>
          <StudentDeliverablePage user={user} />
        </MemoryRouter>
      );
    });

    await waitFor(() => screen.getByText('Edit your submission'));
    expect(screen.getByText('Edit your submission')).toBeDefined();

    expect(screen.queryByTestId('submission-date')).toBe(null);
  });

  it('Shows a loader while the course is loading', async () => {
    fetchMock.mockOnce(JSON.stringify({
      responseCode: -1,
      course: null,
    }));
    fetchMock.mockOnce(JSON.stringify({
      responseCode: -1,
      deliverable: null,
    }));
    fetchMock.mockOnce(JSON.stringify({
      responseCode: -1,
      submission: null,
    }));
    await act(async () => {
      render(
        <MemoryRouter>
          <StudentDeliverablePage user={user} />
        </MemoryRouter>
      );
    });

    expect(screen.getByText('Loading...')).toBeDefined();
  });

  it('Saves the submission when the user clicks the button', async () => {
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      course: registration,
    }));
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      deliverable,
    }));
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      submission: null,
    }));
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
    }));
    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      submission,
    }));
    await act(async () => {
      render(
        <MemoryRouter>
          <StudentDeliverablePage user={user} />
        </MemoryRouter>
      );
    });

    await waitFor(() => screen.getByText('Edit your submission'));
    expect(screen.getByText('Edit your submission')).toBeDefined();

    await act(async () => {
      fireEvent.click(screen.getByText('Upload submission'));
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    const calls = fetchMock.mock.calls;

    expect(calls).toHaveLength(5);
    expect(calls[3][0]).toContain('/submitdeliverable');
  });
});
