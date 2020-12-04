import { useState, useEffect } from 'react';

const apiurl = process.env.API_URL;

export const useStudent = studentId => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [student, setStudent] = useState(null);

  const load = () => {
    setError(null);

    window.fetch(`${apiurl}/student?studentId=${studentId}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(body => body.json()).then(result => {
      if (result.responseCode === 0) {
        setStudent({
          ...result.student,
          birthDate: new Date(result.student.birthDate),
        });
      } else {
        setError(result.errorMessage);
      }
      setLoading(false);
    }).catch(error => {
      setError(error);
    });
  };

  useEffect(load, [studentId]);

  return {
    loading,
    error,
    student,
    reload: load,
  };
};
