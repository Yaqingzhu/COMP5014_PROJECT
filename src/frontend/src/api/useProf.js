import { useState, useEffect } from 'react';

const apiurl = process.env.API_URL;

export const useProf = profId => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [prof, setProf] = useState(null);

  const load = () => {
    setError(null);

    window.fetch(`${apiurl}/profs?profId=${profId}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(body => body.json()).then(result => {
      if (result.responseCode === 0) {
        setProf(result.prof);
      } else {
        setError(result.errorMessage);
      }
      setLoading(false);
    }).catch(error => {
      setError(error);
    });
  };

  useEffect(load, [profId]);

  return {
    loading,
    error,
    prof,
    reload: load,
  };
};
