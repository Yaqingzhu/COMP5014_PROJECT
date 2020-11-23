import React from 'react';
import { useParams } from 'react-router-dom';

import { useCourse } from '../api/useCourse';
import { editCourse } from '../api/courseAPI';
import Loader from '../components/Loader';
import CourseForm from '../components/CourseForm';

export const CoursePage = () => {
  const { id } = useParams();
  const { loading, course, reload } = useCourse(id);

  const handleSave = data => {
    editCourse(parseInt(data.courseId), data).then(() => {
      reload();
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
