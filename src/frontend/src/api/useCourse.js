import { useState, useEffect } from 'react';

const apiurl = process.env.API_URL;

export const useCourse = courseId => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [course, setCourse] = useState(null);

  const load = () => {
    setLoading(true);
    window.fetch(`${apiurl}/course?courseId=${courseId}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(body => body.json()).then(result => {
      setLoading(false);
      if (result.responseCode === 0) {
        setCourse(JSON.parse(result.coursePayload));
      } else {
        setError(result.errorMessage);
      }
    }).catch(error => {
      setError(error);
    });
  };

  useEffect(load, [courseId]);

  return {
    loading,
    error,
    course,
    reload: load,
  };
};
