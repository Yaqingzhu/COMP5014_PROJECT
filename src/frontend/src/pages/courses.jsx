import React from 'react';
import { Link, useHistory } from 'react-router-dom';

import { useCourses } from '../api/useCourses';
import { deleteCourse } from '../api/courseAPI';
import { Loader } from '../components/Loader';

export const CoursesPage = () => {
  const { loading, courses } = useCourses();
  const history = useHistory();

  const handleDeleteCourse = (event, id) => {
    deleteCourse(id).then(() => {
      history.push('/courses');
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
            <tr key={course.id}>
              <th scope="row">{course.id}</th>
              <td>
                <Link to={`/courses/${course.id}`}>{course.name}</Link>
              </td>
              <td>{course.status}</td>
              <td>{course.capacity}</td>
              <td>
                <Link to={`/courses/${course.id}`}>Edit</Link>
                <a href="#" onClick={event => handleDeleteCourse(event, course.id)} className="ml-2">Delete</a>
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
