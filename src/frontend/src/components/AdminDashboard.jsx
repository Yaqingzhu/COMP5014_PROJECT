import React from 'react';
import { Switch, Route, Link, useLocation, matchPath, useHistory } from 'react-router-dom';

import HomePage from '../pages/home';
import CoursesPage from '../pages/courses';
import CoursePage from '../pages/course';
import NewCoursePage from '../pages/newCourse';
import StudentsPage from '../pages/students';
import StudentPage from '../pages/student';
import NewStudentPage from '../pages/newStudent';
import ProfsPage from '../pages/profs';
import ProfPage from '../pages/prof';
import NewProfPage from '../pages/newProf';
import DeadlinesPage from '../pages/deadlines';
import { logOut } from '../api/loginAPI';

export const AdminDashboard = ({ setUser }) => {
  const location = useLocation();
  const history = useHistory();

  const getActive = path => matchPath(location.pathname, {
    path,
  }) !== null ? ' active' : '';

  const handleLogOut = () => {
    logOut().then(() => {
      history.push('/');
      setUser(null);
    });
  };

  return (
    <>
      <nav className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
        <Link className="navbar-brand col-md-3 col-lg-2 mr-0 px-3" to="/">Carleton CMS</Link>
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap">
            <a className="nav-link" href="#" onClick={handleLogOut}>Sign out</a>
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
                    Courses
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link${getActive('/students')}`} to="/students">
                    Students
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link${getActive('/profs')}`} to="/profs">
                    Profs
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link${getActive('/deadlines')}`} to="/deadlines">
                    Academic deadlines
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
          <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-md-4">
            <Switch>
              <Route path="/deadlines">
                <DeadlinesPage />
              </Route>
              <Route path="/profs/new">
                <NewProfPage />
              </Route>
              <Route path="/profs/:id">
                <ProfPage />
              </Route>
              <Route path="/profs">
                <ProfsPage />
              </Route>
              <Route path="/students/new">
                <NewStudentPage />
              </Route>
              <Route path="/students/:id">
                <StudentPage />
              </Route>
              <Route path="/students">
                <StudentsPage />
              </Route>
              <Route path="/courses/new">
                <NewCoursePage />
              </Route>
              <Route path="/courses/:id">
                <CoursePage />
              </Route>
              <Route path="/courses">
                <CoursesPage />
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

export default AdminDashboard;
