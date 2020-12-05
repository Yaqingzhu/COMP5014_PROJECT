import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';

export const DeliverableForm = ({ deliverable, handleSave }) => {
  const [deadline, setDeadline] = useState(deliverable ? deliverable.deliverableDeadline : new Date());
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: deliverable,
  });

  const onSubmit = data => handleSave(data);

  const handleChange = date => {
    setDeadline(date);
    setValue('deliverableDeadline', date.toISOString());
  };

  useEffect(() => {
    register('deliverableDeadline');
  }, [register]);

  return (
    <div>
      <form>
        <div className="mb-3">
          <input
            type="hidden"
            className="form-control"
            name="deliverableId"
            ref={register()}
          />
          <label htmlFor="name">Deliverable type</label>
          <input
            type="text"
            className="form-control"
            data-testid="type"
            placeholder="Some type"
            name="deliverableType"
            ref={register()}
          />
          <br />
          <label htmlFor="deliverableDeadline">Deadline</label>
          <br />
          <DatePicker
            name="deliverableDeadline"
            data-testid="deliverableDeadline"
            className="form-control"
            selected={deadline}
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

export default DeliverableForm;
