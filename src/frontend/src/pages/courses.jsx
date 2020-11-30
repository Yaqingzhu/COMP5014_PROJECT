import React from 'react';
import { Link, useHistory } from 'react-router-dom';

import { useCourses } from '../api/useCourses';
import { deleteCourse, cancelCourse } from '../api/courseAPI';
import { Loader } from '../components/Loader';

export const CoursesPage = () => {
  const { loading, courses, reload } = useCourses();
  const history = useHistory();

  const handleDeleteCourse = (event, course) => {
    deleteCourse(course).then(() => {
      reload();
    });
    event.preventDefault();
  };

  const handleCancelCourse = (event, course) => {
    cancelCourse(course).then(() => {
      reload();
    });
    event.preventDefault();
  };

  return loading || !courses ? (
    <div className="text-center">
      <Loader />
    </div>
  ) : (
    <div>
      <div
        className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Available courses</h1>
        <div className="btn-toolbar mb-2 mb-md-0">
          <div className="btn-group mr-2">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={() => history.push('/courses/new')}
            >
              New course
            </button>
          </div>
        </div>
      </div>
      {courses.length > 0 ? (
        <table className="table table-striped">
          <thead className="thead-dark">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Status</th>
            <th scope="col">Capacity</th>
            <th scope="col">Commands</th>
          </tr>
          </thead>
          <tbody>
          {courses.map(course => (
            <tr key={course.courseId}>
              <th scope="row">{course.courseId}</th>
              <td>
                <Link to={`/courses/${course.courseId}`}>{course.courseName}</Link>
              </td>
              <td>{course.courseStatus}</td>
              <td>{course.courseCapacity}</td>
              <td>
                <Link to={`/courses/${course.courseId}`}>Edit</Link>
                <a href="#" onClick={event => handleCancelCourse(event, course)} className="ml-2">Cancel</a>
                <a href="#" onClick={event => handleDeleteCourse(event, course)} className="ml-2">Delete</a>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      ) : (
        <div className="alert alert-info" role="alert">
          No courses available in the system, <Link to="/courses/new">click here to create one</Link>.
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
