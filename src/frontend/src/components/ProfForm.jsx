import React from 'react';
import { useForm } from 'react-hook-form';

export const ProfForm = ({ prof, handleSave }) => {
  const { register, handleSubmit } = useForm({
    defaultValues: prof,
  });

  const onSubmit = data => handleSave(data);

  return (
    <div>
      <h1 className="mb-3">{prof ? prof.profName : 'New prof'}</h1>
      <form>
        <div className="mb-3">
          <input
            type="hidden"
            className="form-control"
            name="profId"
            ref={register()}
          />
          <label htmlFor="name">Prof name</label>
          <input
            type="text"
            className="form-control"
            data-testid="name"
            placeholder="Some name"
            name="profName"
            ref={register()}
          />
          <label htmlFor="name">Prof password</label>
          <input
            type="password"
            className="form-control"
            data-testid="password"
            placeholder="Some password"
            name="password"
            ref={register()}
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

export default ProfForm;
