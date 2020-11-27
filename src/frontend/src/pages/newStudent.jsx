import React from 'react';
import { useHistory } from 'react-router-dom';

import { createStudent } from '../api/studentAPI';
import StudentForm from '../components/StudentForm';

export const NewStudentPage = () => {
  const history = useHistory();

  const handleSave = data => {
    createStudent(data).then(student => {
      history.push(`/students/${student.studentId}`);
    });
  };

  return (
    <StudentForm handleSave={handleSave} />
  );
};

export default NewStudentPage;
