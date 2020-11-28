import React from 'react';
import { useParams } from 'react-router-dom';

import { useStudent } from '../api/useStudent';
import { editStudent } from '../api/studentAPI';
import Loader from '../components/Loader';
import StudentForm from '../components/StudentForm';

export const StudentPage = () => {
  const { id } = useParams();
  const { loading, student, reload } = useStudent(id);

  const handleSave = data => {
    editStudent(parseInt(data.studentId), data).then(() => {
      reload();
    });
  };

  return loading || !student ? (
    <div className="text-center">
      <Loader />
    </div>
  ) : (
    <StudentForm handleSave={handleSave} student={student} />
  );
};

export default StudentPage;
