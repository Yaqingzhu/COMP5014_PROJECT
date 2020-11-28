import { useState, useEffect } from 'react';

const apiurl = process.env.API_URL;

export const useStudent = studentId => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [student, setStudent] = useState(null);

  const load = () => {
    window.fetch(`${apiurl}/student?studentId=${studentId}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(body => body.json()).then(result => {
      setLoading(false);
      if (result.responseCode === 0) {
        setStudent({
          ...result.student,
          birthDate: new Date(result.student.birthDate),
        });
      } else {
        setError(result.errorMessage);
      }
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
