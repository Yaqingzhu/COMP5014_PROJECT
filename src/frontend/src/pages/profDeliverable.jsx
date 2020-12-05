import React from 'react';
import { useParams } from 'react-router-dom';

import { useDeliverable } from '../api/useDeliverable';
import { useDeliverableSubmissions } from '../api/useDeliverableSubmissions';
import { useCourseStudents } from '../api/useCourseStudents';
import Loader from '../components/Loader';
import moment from 'moment';

export const ProfDeliverablePage = () => {
  const { courseId, deliverableId } = useParams();
  const { loading, deliverable } = useDeliverable(deliverableId);
  const { loading: studentsLoading, students } = useCourseStudents(courseId);
  const { loading: deliverableLoading, submissions, reload } = useDeliverableSubmissions(deliverableId);

  const handleSaveGrade = event => {
    console.log(event.target.value);
    // createDeliverable(parseInt(id), data).then(() => {
      reload();
    // });
  };

  if (loading || deliverableLoading || studentsLoading || !students) {
    return (
      <div className="text-center">
        <Loader />
      </div>
    );
  }

  const studentsWithSubmission = students.map(student => ({
    ...student,
    submission: submissions.find(submission => submission.registrationId === student.registrationId),
  }));

  return (
    <div>
      <div
        className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom"
      >
        <h1 className="h2">Student submissions for deliverable {deliverable.deliverableId}</h1>
      </div>
      <div>
        <strong>
          Due on {moment(deliverable.deliverableDeadline).format('MMMM Do YYYY, h:mm:ss a')}
        </strong>
      </div>
      {students.length > 0 ? (
        <table className="table table-striped">
          <thead className="thead-dark">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Submitted file</th>
            <th scope="col">Grade</th>
          </tr>
          </thead>
          <tbody>
          {studentsWithSubmission.map(student => (
            <tr key={student.registrationId}>
              <th scope="row">{student.studentId}</th>
              <td>
                {student.studentName}
              </td>
              <td>
                {student.submission ? (
                  <>
                    <a
                      href={URL.createObjectURL ? URL.createObjectURL(student.submission.submissionFile) : '#'}
                      download={student.submission.fileName}
                    >
                      {student.submission.fileName}
                    </a>
                    <br />
                    <strong
                      className={student.submission.submissionDate <= deliverable.deliverableDeadline ? 'text-success' : 'text-danger'}
                    >
                      Was submitted on {
                      moment(student.submission.submissionDate).format('MMMM Do YYYY, h:mm:ss a')
                    }
                    </strong>
                  </>
                ) : 'No submission'}
              </td>
              <td>
                {student.submission ? (
                  <input
                    type="number"
                    name={`${student.studentId} _grade`}
                    data-testid={`${student.studentId} _grade`}
                    value={student.submission.submissionGrade || ''}
                    onBlur={handleSaveGrade}
                    readOnly
                  />
                ) : 'No submission'}
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      ) : (
        <div className="alert alert-info" role="alert">
          No students registered in the course.
        </div>
      )}
    </div>
  );
};

export default ProfDeliverablePage;
