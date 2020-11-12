import { useState } from 'react';

export const useLogin = () => {
  const [user, setUser] = useState(null);
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
        setUser({
          username,
        });
        setLoading(false);
      }, 200);
    },
  };
};
