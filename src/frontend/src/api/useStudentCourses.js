import { useState, useEffect } from 'react';

const apiurl = process.env.API_URL;

export const useStudentCourses = user => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState(null);

  const load = () => {
    window.fetch(`${apiurl}/listcourses?studentId=${user.loginId}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(body => body.json()).then(result => {
      if (result.responseCode === 0) {
        setCourses(result.courses ? JSON.parse(result.courses) : []);
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
    courses,
    reload: load,
  };
};
