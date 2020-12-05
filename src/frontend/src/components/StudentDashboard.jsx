import React from 'react';
import { Switch, Route, Link, useLocation, matchPath } from 'react-router-dom';

import { useStudent } from '../api/useStudent';
import Loader from './Loader';
import HomePage from '../pages/home';
import RegisteredCoursesPage from '../pages/registeredCourses';
import RegisterCoursesPage from '../pages/registerCourses';
import StudentCoursePage from '../pages/studentCourse';
import StudentDeliverablePage from '../pages/studentDeliverable';

export const StudentDashboard = ({ user }) => {
  const location = useLocation();
  const { student, loading } = useStudent(user.loginId);

  if (loading || !student) {
    return <Loader />;
  }

  if (!student.admitted) {
    return (
      <div className="container h-100">
        <div className="h-100 row d-flex align-items-center">
          <div className="col-md-6 offset-md-3">
            <div className="card">
              <div className="card-body text-center">
                <div className="alert alert-danger" role="alert">
                  You are not admitted to the university yet, please contact the administration.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getActive = path => matchPath(location.pathname, {
    path,
  }) !== null ? ' active' : '';

  return (
    <>
      <nav className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
        <Link className="navbar-brand col-md-3 col-lg-2 mr-0 px-3" to="/">Carleton CMS</Link>
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap">
            <a className="nav-link" href="#">Sign out</a>
          </li>
        </ul>
      </nav>
      <div className="container-fluid">
        <div className="row">
          <nav
            id="sidebarMenu"
            className="col-md-3 col-lg-2 d-md-block bg-light"
            style={{
              position: 'fixed',
              top: 40,
              bottom: 0,
            }}
          >
            <div className="sidebar-sticky pt-3">
              <ul className="nav flex-column">
                <li className="nav-item">
                  <Link className={`nav-link${getActive('/')}`} to="/">
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link${getActive('/courses')}`} to="/courses">
                    My courses
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
          <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-md-4">
            <Switch>
              <Route path="/courses/:courseId/deliverables/:deliverableId">
                <StudentDeliverablePage user={user} />
              </Route>
              <Route path="/courses/register">
                <RegisterCoursesPage user={user} />
              </Route>
              <Route path="/courses/:id">
                <StudentCoursePage user={user} />
              </Route>
              <Route path="/courses">
                <RegisteredCoursesPage user={user} />
              </Route>
              <Route path="/">
                <HomePage />
              </Route>
            </Switch>
          </main>
        </div>
      </div>
    </>
  );
};

export default StudentDashboard;
