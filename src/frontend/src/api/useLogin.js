import { useState, useContext } from 'react';

import { UserContext } from '../context/userContext';

const apiurl = process.env.API_URL;

export const useLogin = () => {
  const { user, setUser } = useContext(UserContext);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  return {
    loading,
    user,
    error,
    login: (username, password) => {
      setLoading(true);
      setError(null);

      window.fetch(`${apiurl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: username,
          password,
        }),
      }).then(body => body.json()).then(result => {
        setLoading(false);
        if (result.loginStatus === 0) {
          setUser({
            username,
            role: result.loginRole,
          });
        } else {
          setError(result.message);
        }
      }).catch(error => {
        setError(error);
      });
    },
  };
};
