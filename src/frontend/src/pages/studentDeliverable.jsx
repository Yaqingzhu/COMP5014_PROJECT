import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment';

import { useStudentCourse } from '../api/useStudentCourse';
import { useDeliverable } from '../api/useDeliverable';
import { useDeliverableSubmission } from '../api/useDeliverableSubmission';
import { submitDeliverable } from '../api/deliverableAPI';
import { Loader } from '../components/Loader';

export const StudentDeliverablePage = ({ user }) => {
  const [file, setFile] = useState(null);
  const { courseId, deliverableId } = useParams();
  const { loading, course } = useStudentCourse(user.loginId, courseId);
  const { loading: deliverableLoading, deliverable } = useDeliverable(deliverableId);
  const { loading: submissionLoading, submission, reload } = useDeliverableSubmission(course && course.registrationId, deliverableId);

  const uploadSubmission = () => {
    submitDeliverable(deliverableId, course.registrationId, file).then(() => {
      reload();
    });
  };

  const handleFileSelection = event => {
    setFile(event.target.files[0]);
  };

  if (loading || deliverableLoading || submissionLoading || !deliverable) {
    return (
      <div className="text-center">
        <Loader />
      </div>
    );
  }

  return (
    <div>
      <div
        className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom"
      >
        <h1 className="h2">
          Edit your submission
        </h1>
      </div>
      {submission ? (
        <div>
          <h3 className="h4">
            Submitted file
          </h3>
          <a href={URL.createObjectURL ? URL.createObjectURL(submission.submissionFile) : '#'} download={submission.fileName}>
            {submission.fileName}
          </a>
          <br />
          <strong className="text-success" data-testid="submission-date">
            Was submitted on {
            moment(submission.submissionDate).format('MMMM Do YYYY, h:mm:ss a')
          }
          </strong>
          <div>
            <strong>Grade: </strong> {submission.submissionGrade || 'Not yet graded'}
          </div>
          <hr />
        </div>
      ) : null}
      <form>
        <h2 className="h3" data-testid="due-date">
          This deliverable is due on the {
            moment(deliverable.deliverableDeadline).format('MMMM Do YYYY, h:mm:ss a')
          }.
        </h2>
        <div className="mb-3">
          <label htmlFor="file">Submission file</label>
          <input
            name="file"
            data-testid="file"
            className="form-control"
            type="file"
            onChange={handleFileSelection}
          />
        </div>
        <hr className="mb-4" />
        <button
          className="btn btn-primary btn-lg btn-block"
          type="button"
          onClick={uploadSubmission}
        >
          Upload submission
        </button>
      </form>
    </div>
  );
};

export default StudentDeliverablePage;
