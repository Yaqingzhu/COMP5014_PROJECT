import React, { useState } from 'react';

export const CourseForm = ({ course, handleSave }) => {
  const [name, setName] = useState(course ? course.name : '');
  const [status, setStatus] = useState(course ? course.status : '');
  const [capacity, setCapacity] = useState(course ? course.capacity : '');

  return (
    <div>
      <h1 className="mb-3">{course ? course.name : 'New course'}</h1>
      <form>
        <div className="mb-3">
          <label htmlFor="name">Course name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            placeholder="Some name"
            value={name}
            onChange={event => setName(event.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="status">Course status</label>
          <input
            type="text"
            className="form-control"
            id="status"
            placeholder="Some status"
            value={status}
            onChange={event => setStatus(event.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="status">Course status</label>
          <input
            type="number"
            className="form-control"
            id="capacity"
            placeholder="200"
            value={capacity}
            onChange={event => setCapacity(event.target.value)}
          />
        </div>
        <hr className="mb-4" />
        <button
          className="btn btn-primary btn-lg btn-block"
          type="button"
          onClick={() => handleSave(name, status, capacity)}
        >
          Save changes
        </button>
      </form>
    </div>
  );
};

export default CourseForm;
