import { useState, useEffect } from 'react';
import { students as studentsMocks } from '../mocks/students';

const apiurl = process.env.API_URL;

export const useStudents = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [students, setStudents] = useState(null);

  const load = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStudents(studentsMocks);
    }, 500);
    /* window.fetch(`${apiurl}/course`, {
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
    }); */
  };

  useEffect(load, []);

  return {
    loading,
    error,
    students,
    reload: load,
  };
};
