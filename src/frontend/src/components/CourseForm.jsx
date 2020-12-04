import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';

export const CourseForm = ({ course, profs, handleSave }) => {
  const { control, register, handleSubmit } = useForm({
    defaultValues: course,
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'courseSlots'
  });

  const onSubmit = data => handleSave(data);

  return (
    <div>
      <h1 className="mb-3">{course ? course.courseName : 'New course'}</h1>
      <form>
        <div className="mb-3">
          <input
            type="hidden"
            className="form-control"
            name="courseId"
            ref={register()}
          />
          <label htmlFor="name">Course name</label>
          <input
            type="text"
            className="form-control"
            data-testid="name"
            placeholder="Some name"
            name="courseName"
            ref={register()}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="status">Course status</label>
          <select
            className="form-control"
            name="courseStatus"
            data-testid="status"
            ref={register()}
            defaultValue={course && course.courseStatus}
          >
            <option value="scheduled">Open</option>
            <option value="unscheduled">Closed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="capacity">Course capacity</label>
          <input
            type="number"
            className="form-control"
            data-testid="capacity"
            placeholder="200"
            name="courseCapacity"
            ref={register()}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="capacity">Assigned prof</label>
          <select
            className="form-control"
            name="assignedProf"
            data-testid="assignedProf"
            defaultValue={course ? course.assignedProf : null}
            ref={register()}
          >
            <option key="null" value={null}>No prof</option>
            {profs.map(prof => (
              <option key={prof.profId} value={prof.profId}>
                {prof.profName}
              </option>
            ))}
          </select>
        </div>
        <hr className="mb-4" />
        {fields.map((item, index) => (
          <div className="card" key={item.id}>
            <div className="card-body">
              <div className="form-row">
                <div className="col">
                  <select
                    className="form-control"
                    name={`courseSlots[${index}].day`}
                    defaultValue={item.day}
                    ref={register()}
                  >
                    <option value="1">Monday</option>
                    <option value="2">Tuesday</option>
                    <option value="3">Wednesday</option>
                    <option value="4">Thursday</option>
                    <option value="5">Friday</option>
                  </select>
                </div>
                <div className="col">
                  <select
                    className="form-control"
                    name={`courseSlots[${index}].time`}
                    defaultValue={item.time}
                    ref={register()}
                  >
                    <option value="07:00:00.000000">07:00 AM</option>
                    <option value="07:30:00.000000">07:30 AM</option>
                    <option value="08:00:00.000000">08:00 AM</option>
                    <option value="08:30:00.000000">08:30 AM</option>
                    <option value="09:00:00.000000">09:00 AM</option>
                    <option value="09:30:00.000000">09:30 AM</option>
                    <option value="10:00:00.000000">10:00 AM</option>
                    <option value="10:30:00.000000">10:30 AM</option>
                    <option value="11:00:00.000000">11:00 AM</option>
                    <option value="11:30:00.000000">11:30 AM</option>
                    <option value="12:00:00.000000">12:00 PM</option>
                    <option value="12:30:00.000000">12:30 PM</option>
                    <option value="13:00:00.000000">01:00 PM</option>
                    <option value="13:30:00.000000">01:30 PM</option>
                    <option value="14:00:00.000000">02:00 PM</option>
                    <option value="14:30:00.000000">02:30 PM</option>
                    <option value="15:00:00.000000">03:00 PM</option>
                    <option value="15:30:00.000000">03:30 PM</option>
                    <option value="16:00:00.000000">04:00 PM</option>
                    <option value="16:30:00.000000">04:30 PM</option>
                    <option value="17:00:00.000000">05:00 PM</option>
                    <option value="17:30:00.000000">05:30 PM</option>
                    <option value="18:00:00.000000">06:00 PM</option>
                    <option value="18:30:00.000000">06:30 PM</option>
                    <option value="19:00:00.000000">07:00 PM</option>
                    <option value="19:30:00.000000">07:30 PM</option>
                    <option value="20:00:00.000000">08:00 PM</option>
                  </select>
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
