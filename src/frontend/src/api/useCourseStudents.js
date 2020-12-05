import { useState, useEffect } from 'react';

const apiurl = process.env.API_URL;

export const useCourseStudents = courseId => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [students, setStudents] = useState(null);

  const load = () => {
    setError(null);

    window.fetch(`${apiurl}/coursestudents?courseId=${courseId}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(body => body.json()).then(result => {
      if (result.responseCode === 0) {
        setStudents(result.students.map(student => ({
          ...student,
          birthDate: new Date(student.birthDate),
        })));
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
    students,
    reload: load,
  };
};
