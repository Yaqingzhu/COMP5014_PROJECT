import { useState, useEffect } from 'react';

import { courses as mockCourses } from '../mocks/courses';

export const useCourse = courseId => {
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState(null);

  useEffect(() => {
    setLoading(true);
    // TODO
    setTimeout(() => {
      setLoading(false);
      setCourse(mockCourses.find(course => course.id === parseInt(courseId)));
    }, 500);
  }, [courseId]);

  return {
    loading,
    course,
  };
};
