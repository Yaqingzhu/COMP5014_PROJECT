import React from 'react';
import { Link, useHistory } from 'react-router-dom';

import { useStudentCourses } from '../api/useStudentCourses';
import { dropCourse } from '../api/studentAPI';
import { Loader } from '../components/Loader';

export const RegisteredCoursesPage = ({ user }) => {
  const { loading, courses, reload } = useStudentCourses(user);
  const history = useHistory();

  const handleDropCourse = (event, course) => {
    dropCourse(user, course).then(() => {
      reload();
    });
    event.preventDefault();
  };

  if (loading) {
    return (
      <div className="text-center">
        <Loader />
      </div>
    );
  }

  const registeredCourses = courses.filter(course => course.dropDate === null);
  const droppedCourses = courses.filter(course => course.dropDate !== null);

  return (
    <div>
      <div
        className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom"
      >
        <h1 className="h2">My courses</h1>
        <div className="btn-toolbar mb-2 mb-md-0">
          <div className="btn-group mr-2">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={() => history.push('/courses/register')}
            >
              Register to a new course
            </button>
          </div>
        </div>
      </div>
      {registeredCourses.length > 0 ? (
        <table className="table table-striped">
          <thead className="thead-dark">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Registered on</th>
            <th scope="col">Grade</th>
            <th scope="col">Commands</th>
          </tr>
          </thead>
          <tbody>
          {registeredCourses.map(course => (
            <tr key={course.courseId}>
              <th scope="row">{course.courseId}</th>
              <td>{course.courseName}</td>
              <td>{course.registrationDate}</td>
              <td>{course.finalGrade}</td>
              <td>
                <a href="#" onClick={event => handleDropCourse(event, course)}>Drop</a>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      ) : (
        <div className="alert alert-info" role="alert">
          You have not registered to any course, <Link to="/courses/register">click here to register</Link>.
        </div>
      )}
      <h1 className="h2">Dropped courses</h1>
      {droppedCourses.length > 0 && (
        <table className="table table-striped" data-testid="dropped-courses">
          <thead className="thead-dark">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Dropped on</th>
          </tr>
          </thead>
          <tbody>
          {droppedCourses.map(course => (
            <tr key={course.courseId}>
              <th scope="row">{course.courseId}</th>
              <td>{course.courseName}</td>
              <td>{course.dropDate}</td>
            </tr>
          ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RegisteredCoursesPage;
