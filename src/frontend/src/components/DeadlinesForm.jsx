import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';

export const DeadlinesForm = ({ deadlines, handleSave }) => {
  const [registrationDeadline, setRegistrationDeadline] = useState(deadlines ? deadlines.registrationDeadline : new Date());
  const [dropDeadline, setDropDeadline] = useState(deadlines ? deadlines.dropDeadline : new Date());
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: deadlines,
  });

  const onSubmit = data => handleSave(data);

  const handleRegistrationChange = date => {
    setRegistrationDeadline(date);
    setValue('registrationDeadline', date.toISOString());
  };

  const handleDropChange = date => {
    setDropDeadline(date);
    setValue('dropDeadline', date.toISOString());
  };

  useEffect(() => {
    register('registrationDeadline');
    register('dropDeadline');
  }, [register]);

  return (
    <div>
      <div
        className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom"
      >
        <h1 className="h2">Academic deadlines</h1>
      </div>
      <form>
        <div className="mb-3">
          <label htmlFor="name">Deadlines for registration</label>
          <br />
          <DatePicker
            name="registrationDeadline"
            data-testid="registrationDeadline"
            className="form-control"
            selected={registrationDeadline}
            onChange={handleRegistrationChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="name">Deadlines for dropping courses</label>
          <br />
          <DatePicker
            name="dropDeadline"
            data-testid="dropDeadline"
            className="form-control"
            selected={dropDeadline}
            onChange={handleDropChange}
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

export default DeadlinesForm;
