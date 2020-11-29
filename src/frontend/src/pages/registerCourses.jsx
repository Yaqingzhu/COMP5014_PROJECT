import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useStudentCourses } from '../api/useStudentCourses';
import { useCourses } from '../api/useCourses';
import { registerCourse } from '../api/studentAPI';
import { Loader } from '../components/Loader';

export const RegisterCoursesPage = ({ user }) => {
  const { loading: studentLoading, courses: studentCourses } = useStudentCourses(user);
  const { loading: availableLoading, courses } = useCourses();
  const [selectedCourses, setSelectedCourses] = useState([]);
  const history = useHistory();

  const handleRegisterCourse = () => {
    Promise.all(selectedCourses.map(course => registerCourse(user, course))).then(() => {
      history.push('/courses');
    });
  };

  const handleChecked = course => {
    if (selectedCourses.find(el => el.courseId === course.courseId)) {
      setSelectedCourses(selectedCourses.filter(el => el.courseId === course.courseId));
    } else {
      setSelectedCourses(selectedCourses.concat(course));
    }
  };

  if (studentLoading || availableLoading) {
    return (
      <div className="text-center">
        <Loader />
      </div>
    );
  }

  const availableCourses = courses.filter(
    course => course.courseStatus === 'scheduled' && !studentCourses.find(studentCourse => studentCourse.courseId === course.courseId)
  );

  return (
    <div>
      <div
        className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom"
      >
        <h1 className="h2">Available courses</h1>
      </div>
      {availableCourses.length > 0 ? (
        <>
          <table className="table table-striped">
            <thead className="thead-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Select</th>
            </tr>
            </thead>
            <tbody>
            {availableCourses.map(course => (
              <tr key={course.courseId}>
                <th scope="row">{course.courseId}</th>
                <td>{course.courseName}</td>
                <td>
                  <input
                    type="checkbox"
                    data-testid={`check-${course.courseId}`}
                    value={selectedCourses.find(el => el.courseId === course.courseId)}
                    onChange={() => handleChecked(course)}
                  />
                </td>
              </tr>
            ))}
            </tbody>
          </table>
          <hr className="mb-4" />
          <button
            className="btn btn-primary btn-lg btn-block"
            type="button"
            onClick={handleRegisterCourse}
          >
            Register
          </button>
        </>
      ) : (
        <div className="alert alert-info" role="alert">
          There are not available courses at this time
        </div>
      )}
    </div>
  );
};

export default RegisterCoursesPage;
