import React from 'react';
import { useHistory } from 'react-router-dom';

import { createCourse } from '../api/courseAPI';
import CourseForm from '../components/CourseForm';
import Loader from '../components/Loader';
import { useProfs } from '../api/useProfs';

export const NewCoursePage = () => {
  const history = useHistory();
  const { loading, profs } = useProfs();

  const handleSave = data => {
    createCourse(data).then(course => {
      history.push(`/courses/${course.courseId}`);
    });
  };

  return loading ? (
    <div className="text-center">
      <Loader />
    </div>
  ) : (
    <CourseForm handleSave={handleSave} profs={profs} />
  );
};

export default NewCoursePage;
