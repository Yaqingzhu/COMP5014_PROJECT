import React from 'react';
import { useParams } from 'react-router-dom';

import { useCourse } from '../api/useCourse';
import { useCourseDeliverables } from '../api/useCourseDeliverables';
import { useCourseStudents } from '../api/useCourseStudents';
import { createDeliverable, editDeliverable, deleteDeliverable } from '../api/deliverableAPI';
import Loader from '../components/Loader';
import DeliverableForm from '../components/DeliverableForm';

export const ProfCoursePage = () => {
  const { id } = useParams();
  const { loading, course } = useCourse(id);
  const { loading: deliverableLoading, deliverables, reload } = useCourseDeliverables(id);
  const { loading: studentsLoading, students } = useCourseStudents(id);

  const handleNewDeliverable = data => {
    createDeliverable(parseInt(id), data).then(() => {
      reload();
    });
  };

  const handleEditDeliverable = data => {
    editDeliverable(parseInt(data.deliverableId), data).then(() => {
      reload();
    });
  };

  const handleDeleteDeliverable = data => {
    deleteDeliverable(parseInt(data.deliverableId)).then(() => {
      reload();
    });
  };

  return loading || deliverableLoading || studentsLoading || !course ? (
    <div className="text-center">
      <Loader />
    </div>
  ) : (
    <div>
      <div
        className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom"
      >
        <h1 className="h2">{course.courseName}</h1>
      </div>
      <h2 className="h3">Deliverables</h2>
      <div className="row row-cols-1 row-cols-md-4">
        {deliverables.map(deliverable => (
          <div className="col mb-4" key={deliverable.deliverableId}>
            <div className="card m-2">
              <div className="card-body">
                <h5 className="card-title">Deliverable #{deliverable.deliverableId}</h5>
                <DeliverableForm deliverable={deliverable} handleSave={handleEditDeliverable} />
                <a
                  href="#"
                  className="card-link"
                  onClick={() => handleDeleteDeliverable(deliverable)}
                >
                  Delete
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
      <hr className="my-3" />
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Add a new deliverable</h5>
          <DeliverableForm handleSave={handleNewDeliverable} />
        </div>
      </div>
      <h2 className="h3">Students registered in the course</h2>
      {students.length > 0 ? (
        <table className="table table-striped">
          <thead className="thead-dark">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
          </tr>
          </thead>
          <tbody>
          {students.map(student => (
            <tr key={student.studentId}>
              <th scope="row">{student.studentId}</th>
              <td>
                {student.studentName}
              </td>
              <td>{student.studentEmail}</td>
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

export default ProfCoursePage;
