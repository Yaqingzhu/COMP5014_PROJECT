import { useState, useEffect } from 'react';

const apiurl = process.env.API_URL;

export const useCourses = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState(null);

  const load = () => {
    setLoading(true);
    window.fetch(`${apiurl}/course`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(body => body.json()).then(result => {
      setLoading(false);
      if (result.responseCode === 0) {
        setCourses(result.coursePayload.map(result => JSON.parse(result.result)));
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
    courses,
    reload: load,
  };
};
