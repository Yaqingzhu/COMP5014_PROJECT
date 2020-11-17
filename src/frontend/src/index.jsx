import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import { UserProvider } from './context/userContext';

import App from './components/App';

render((
  <Router>
    <UserProvider>
      <App />
    </UserProvider>
  </Router>
), document.querySelector('#app'));
