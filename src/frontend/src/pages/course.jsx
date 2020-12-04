import React from 'react';
import { useParams } from 'react-router-dom';

import { useCourse } from '../api/useCourse';
import { useProfs } from '../api/useProfs';
import { editCourse } from '../api/courseAPI';
import Loader from '../components/Loader';
import CourseForm from '../components/CourseForm';

export const CoursePage = () => {
  const { id } = useParams();
  const { loading, course, reload } = useCourse(id);
  const { loading: profLoading, profs } = useProfs();

  const handleSave = data => {
    editCourse(parseInt(data.courseId), data).then(() => {
      reload();
    });
  };

  return loading || profLoading || !course ? (
    <div className="text-center">
      <Loader />
    </div>
  ) : (
    <CourseForm handleSave={handleSave} course={course} profs={profs} />
  );
};

export default CoursePage;
