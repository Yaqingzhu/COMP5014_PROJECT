import React from 'react';
import { useHistory } from 'react-router-dom';

import { createCourse } from '../api/courseAPI';
import CourseForm from '../components/CourseForm';

export const NewCoursePage = () => {
  const history = useHistory();

  const handleSave = data => {
    createCourse(data).then(course => {
      history.push(`/courses/${course.id}`);
    });
  };

  return (
    <CourseForm handleSave={handleSave} />
  );
};

export default NewCoursePage;
