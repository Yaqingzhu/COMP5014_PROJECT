import React from 'react';
import { Link } from 'react-router-dom';

import { useProfCourses } from '../api/useProfCourses';
import { Loader } from '../components/Loader';

export const ProfCoursesPage = ({ user }) => {
  const { loading, courses } = useProfCourses(user);

  if (loading || !courses) {
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
        <h1 className="h2">My courses</h1>
      </div>
      {courses.length > 0 ? (
        <table className="table table-striped">
          <thead className="thead-dark">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Commands</th>
          </tr>
          </thead>
          <tbody>
          {courses.map(course => (
            <tr key={course.courseId}>
              <th scope="row">{course.courseId}</th>
              <td>{course.courseName}</td>
              <td>
                <Link to={`/courses/${course.courseId}`}>Edit</Link>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      ) : (
        <div className="alert alert-info" role="alert">
          You have not have any courses assigned to you.
        </div>
      )}
    </div>
  );
};

export default ProfCoursesPage;
