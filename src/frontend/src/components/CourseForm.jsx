import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';

export const CourseForm = ({ course, handleSave }) => {
  const { control, register, handleSubmit } = useForm({
    defaultValues: course,
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'course_slots'
  });

  const onSubmit = data => handleSave(data);

  return (
    <div>
      <h1 className="mb-3">{course ? course.name : 'New course'}</h1>
      <form>
        <div className="mb-3">
          <input
            type="hidden"
            className="form-control"
            name="id"
            ref={register()}
          />
          <label htmlFor="name">Course name</label>
          <input
            type="text"
            className="form-control"
            data-testid="name"
            placeholder="Some name"
            name="name"
            ref={register()}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="status">Course status</label>
          <input
            type="text"
            className="form-control"
            data-testid="status"
            placeholder="Some status"
            name="status"
            ref={register()}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="capacity">Course capacity</label>
          <input
            type="number"
            className="form-control"
            data-testid="capacity"
            placeholder="200"
            name="capacity"
            ref={register()}
          />
        </div>
        <hr className="mb-4" />
        {fields.map((item, index) => (
          <div className="card" key={item.id}>
            <div className="card-body">
              <div className="form-row">
                <div className="col">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Day"
                    name={`course_slots[${index}].day`}
                    defaultValue={item.day}
                    ref={register()}
                  />
                </div>
                <div className="col">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Time"
                    name={`course_slots[${index}].time`}
                    defaultValue={item.time}
                    ref={register()}
                  />
                </div>
              </div>
              <button className="btn btn-secondary my-4" onClick={() => remove(index)}>Delete slot</button>
            </div>
          </div>
        ))}
        <button
          type="button"
          className="btn btn-secondary my-4"
          onClick={() => {
            append({ name: 'append' });
          }}
        >
          Add new slot
        </button>
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

export default CourseForm;
