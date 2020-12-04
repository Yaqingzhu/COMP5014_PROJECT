import { useState, useEffect } from 'react';

const apiurl = process.env.API_URL;

export const useDeadlines = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deadlines, setDeadlines] = useState(null);

  const load = () => {
    setError(null);

    window.fetch(`${apiurl}/academicline`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(body => body.json()).then(result => {
      if (result.responseCode === 0) {
        setDeadlines({
          registrationDeadline: new Date(result.registrationDeadline),
          dropDeadline: new Date(result.dropDeadline),
        });
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
    deadlines,
    reload: load,
  };
};
