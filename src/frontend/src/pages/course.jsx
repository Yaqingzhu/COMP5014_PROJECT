import React from 'react';
import { useParams, useHistory } from 'react-router-dom';

import { useCourse } from '../api/useCourse';
import { editCourse } from '../api/courseAPI';
import Loader from '../components/Loader';
import CourseForm from '../components/CourseForm';

export const CoursePage = () => {
  const { id } = useParams();
  const history = useHistory();
  const { loading, course } = useCourse(id);

  const handleSave = (name, status, capacity) => {
    editCourse(id, { name, status, capacity }).then(() => {
      history.push(`/courses/${id}`);
    });
  };

  return loading || !course ? (
    <div className="text-center">
      <Loader />
    </div>
  ) : (
    <CourseForm handleSave={handleSave} course={course} />
  );
};

export default CoursePage;
