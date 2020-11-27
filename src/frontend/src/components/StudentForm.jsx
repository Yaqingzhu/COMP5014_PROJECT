import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';

export const StudentForm = ({ student, handleSave }) => {
  const [birthDate, setBirthDate] = useState(student.birthDate);
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: student,
  });

  const onSubmit = data => handleSave(data);

  const handleChange = date => {
    setBirthDate(date);
    setValue('birthDate', date);
  };

  useEffect(() => {
    register('birthDate');
  }, [register]);

  return (
    <div>
      <h1 className="mb-3">{student ? student.studentName : 'New student'}</h1>
      <form>
        <div className="mb-3">
          <input
            type="hidden"
            className="form-control"
            name="studentId"
            ref={register()}
          />
          <label htmlFor="name">Student name</label>
          <input
            type="text"
            className="form-control"
            data-testid="name"
            placeholder="Some name"
            name="studentName"
            ref={register()}
          />
          <label htmlFor="email">Student email</label>
          <input
            type="email"
            className="form-control"
            data-testid="email"
            placeholder="email@some.domain"
            name="studentEmail"
            ref={register()}
          />
          <label htmlFor="admitted">Admitted</label>
          <br />
          <input
            type="checkbox"
            data-testid="admitted"
            name="admitted"
            ref={register()}
          />
          <br />
          <label htmlFor="birthDate">Birth date</label>
          <br />
          <DatePicker
            name="birthDate"
            data-testid="birthDate"
            className="form-control"
            selected={birthDate}
            onChange={handleChange}
          />
        </div>
        <hr className="mb-4" />
        <button
          className="btn btn-primary btn-lg btn-block"
          type="button"
          onClick={handleSubmit(onSubmit)}
        >
          Save changes
        </button>
      </form>
    </div>
  );
};

export default StudentForm;
