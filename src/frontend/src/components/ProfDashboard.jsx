import React from 'react';
import { Switch, Route, Link, useLocation, matchPath } from 'react-router-dom';

import HomePage from '../pages/home';
import ProfCoursesPage from '../pages/profCourses';
import ProfCoursePage from '../pages/profCourse';
import ProfDeliverablePage from '../pages/profDeliverable';

export const ProfDashboard = ({ user }) => {
  const location = useLocation();

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
                <ProfDeliverablePage user={user} />
              </Route>
              <Route path="/courses/:id">
                <ProfCoursePage user={user} />
              </Route>
              <Route path="/courses">
                <ProfCoursesPage user={user} />
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

export default ProfDashboard;
