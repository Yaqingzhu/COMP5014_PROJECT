import React from 'react';
import { Link, useHistory } from 'react-router-dom';

import { useStudents } from '../api/useStudents';
import { deleteStudent } from '../api/studentAPI';
import { Loader } from '../components/Loader';

export const CoursesPage = () => {
  const { loading, students, reload } = useStudents();
  const history = useHistory();

  const handleDeleteStudent = (event, student) => {
    deleteStudent(student).then(() => {
      reload();
    });
    event.preventDefault();
  };

  return loading || !students ? (
    <div className="text-center">
      <Loader />
    </div>
  ) : (
    <div>
      <div
        className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Available students</h1>
        <div className="btn-toolbar mb-2 mb-md-0">
          <div className="btn-group mr-2">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={() => history.push('/students/new')}
            >
              New student
            </button>
          </div>
        </div>
      </div>
      {students.length > 0 ? (
        <table className="table table-striped">
          <thead className="thead-dark">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Admitted</th>
            <th scope="col">Commands</th>
          </tr>
          </thead>
          <tbody>
          {students.map(student => (
            <tr key={student.studentId}>
              <th scope="row">{student.studentId}</th>
              <td>
                <Link to={`/students/${student.studentId}`}>{student.studentName}</Link>
              </td>
              <td>{student.studentEmail}</td>
              <td>
                <input
                  type="checkbox"
                  checked={student.admitted}
                  disabled
                />
              </td>
              <td>
                <Link to={`/students/${student.studentId}`}>Edit</Link>
                <a href="#" onClick={event => handleDeleteStudent(event, student)} className="ml-2">Delete</a>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      ) : (
        <div className="alert alert-info" role="alert">
          No students available in the system, <Link to="/students/new">click here to create one</Link>.
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
