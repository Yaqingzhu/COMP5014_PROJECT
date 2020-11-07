import React, { useState, useEffect } from 'react';

const API_URL = process.env.API_URL;

export const App = () => {
  const [message, setMessage] = useState(null);

  useEffect(() => {
    window.fetch(API_URL).then(result => {
      debugger;
      return result.text();
    }).then(val => setMessage(val));
  }, []);

  return message ? (
      <h1>
        {message}
      </h1>
    ) : 'loading...';
};

export default App;
