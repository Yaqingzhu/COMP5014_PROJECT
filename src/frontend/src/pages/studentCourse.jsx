import React from 'react';
import { Link, useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';

import { useStudentCourse } from '../api/useStudentCourse';
import { useCourseDeliverables } from '../api/useCourseDeliverables';
import { Loader } from '../components/Loader';

export const StudentCoursePage = ({ user }) => {
  const { id } = useParams();
  const { loading, course } = useStudentCourse(user.loginId, id);
  const { loading: deliverableLoading, deliverables } = useCourseDeliverables(id);

  if (loading || deliverableLoading || !course) {
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
        <h1 className="h2">{course.courseName}</h1>
      </div>
      <h2 className="h3">Deliverables</h2>
      <div className="row row-cols-1 row-cols-md-4">
        {deliverables.map(deliverable => (
          <div className="col mb-4" key={deliverable.deliverableId}>
            <div className="card m-2">
              <div className="card-body">
                <Link to={`/courses/${course.courseId}/deliverables/${deliverable.deliverableId}`}>
                  <h5 className="card-title">
                    Deliverable #{deliverable.deliverableId}
                  </h5>
                </Link>
                <label htmlFor="name">Deliverable type</label>
                <input
                  type="text"
                  className="form-control"
                  value={deliverable.deliverableType}
                  readOnly
                />
                <br />
                <label htmlFor="deliverableDeadline">Deadline</label>
                <br />
                <DatePicker
                  className="form-control"
                  selected={deliverable.deliverableDeadline}
                  readOnly
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentCoursePage;
