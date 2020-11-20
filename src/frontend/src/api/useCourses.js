import { useState, useEffect } from 'react';

import { courses as mockCourses } from '../mocks/courses';

export const useCourses = () => {
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState(null);

  useEffect(() => {
    setLoading(true);
    // TODO
    setTimeout(() => {
      setLoading(false);
      setCourses(mockCourses);
    }, 500);
  }, []);

  return {
    loading,
    courses,
  };
};
