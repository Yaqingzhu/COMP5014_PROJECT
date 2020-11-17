import { useState, useContext } from 'react';

import { UserContext } from '../context/userContext';

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
      // TODO
      setTimeout(() => {
        setLoading(false);
        setUser({
          username,
        });
      }, 200);
    },
  };
};
