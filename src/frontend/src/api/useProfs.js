import { useState, useEffect } from 'react';

const apiurl = process.env.API_URL;

export const useProfs = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profs, setProfs] = useState(null);

  const load = () => {
    setError(null);

    window.fetch(`${apiurl}/profs`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(body => body.json()).then(result => {
      if (result.responseCode === 0) {
        setProfs(result.profs);
      } else {
        setError(result.errorMessage);
      }
      setLoading(false);
    }).catch(error => {
      setError(error);
    });
  };

  useEffect(load, []);

  return {
    loading,
    error,
    profs,
    reload: load,
  };
};
