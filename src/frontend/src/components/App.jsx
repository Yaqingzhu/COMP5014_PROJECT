import React from 'react';
import { Switch, Route } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-datepicker/dist/react-datepicker.css';

import { WithUser } from '../context/userContext';
import Login from '../pages/login';
import Register from '../pages/register';
import Dashboard from './Dashboard';

export const App = () => (
  <WithUser>
    {({ user, setUser }) => user ? (
      <Dashboard user={user} setUser={setUser} />
    ) : (
      <Switch>
        <Route path="/register">
          <Register />
        </Route>
        <Route path="*">
          <Login />
        </Route>
      </Switch>
    )}
  </WithUser>
);

export default App;
