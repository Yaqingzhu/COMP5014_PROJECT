import { useState, useEffect } from 'react';

const apiurl = process.env.API_URL;

export const useStudentCourse = (studentId, courseId) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [course, setCourse] = useState(null);

  const load = () => {
    setError(null);

    window.fetch(`${apiurl}/registeredcourse?studentId=${studentId}&courseId=${courseId}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(body => body.json()).then(result => {
      if (result.responseCode === 0) {
        setCourse(result.course);
      } else {
        setError(result.errorMessage);
      }
      setLoading(false);
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