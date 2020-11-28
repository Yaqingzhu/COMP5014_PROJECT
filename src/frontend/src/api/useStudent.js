import { useState, useEffect } from 'react';
import { students } from '../mocks/students';

const apiurl = process.env.API_URL;

export const useStudent = studentId => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [student, setStudent] = useState(null);

  const load = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStudent(students[0]);
    }, 500);

    /* window.fetch(`${apiurl}/course?courseId=${studentId}`, {
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
    }); */
  };

  useEffect(load, [studentId]);

  return {
    loading,
    error,
    student,
    reload: load,
  };
};
