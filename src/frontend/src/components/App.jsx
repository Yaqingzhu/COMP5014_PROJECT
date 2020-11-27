import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-datepicker/dist/react-datepicker.css';

import { WithUser } from '../context/userContext';
import Login from '../pages/login';
import Dashboard from './Dashboard';

export const App = () => (
  <WithUser>
    {({ user }) => user ? (
      <Dashboard user={user} />
    ) : <Login />}
  </WithUser>
);

export default App;
