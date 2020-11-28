import { useState, useEffect } from 'react';

const apiurl = process.env.API_URL;

export const useStudents = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [students, setStudents] = useState(null);

  const load = () => {
    window.fetch(`${apiurl}/students`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(body => body.json()).then(result => {
      setLoading(false);
      if (result.responseCode === 0) {
        setStudents(result.students.map(student => ({
          ...student,
          birthDate: new Date(student.birthDate),
        })));
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
    students,
    reload: load,
  };
};
