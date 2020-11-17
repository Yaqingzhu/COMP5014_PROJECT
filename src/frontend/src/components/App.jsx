import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

import { WithUser } from '../context/userContext';
import Login from '../pages/login';

export const App = () => (
  <WithUser>
    {({ user }) => user ? (
      <h1>Hello, World!</h1>
    ) : <Login />}
  </WithUser>
);

export default App;
