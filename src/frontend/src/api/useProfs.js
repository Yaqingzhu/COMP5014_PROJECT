import { useState, useEffect } from 'react';

const apiurl = process.env.API_URL;

export const useProfs = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profs, setProfs] = useState(null);

  const load = () => {
    window.fetch(`${apiurl}/profs`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(body => body.json()).then(result => {
      setLoading(false);
      if (result.responseCode === 0) {
        setProfs(result.profs);
      } else {
        setError(result.errorMessage);
      }
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
