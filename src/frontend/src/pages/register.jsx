import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import { useHistory } from 'react-router-dom';

import logo from 'url:../assets/carleton.png';
import { register as APIRegister } from '../api/studentAPI';

export const Register = () => {
  const [birthDate, setBirthDate] = useState(new Date());
  const { register, handleSubmit, setValue } = useForm();
  const history = useHistory();

  const onSubmit = data => {
    APIRegister(data).then(() => {
      history.push('/');
    });
  };

  const handleChange = date => {
    setBirthDate(date);
    setValue('birthDate', date.toISOString().slice(0, 10));
  };

  useEffect(() => {
    register('birthDate', { required: true });
    setValue('birthDate', birthDate);
  }, [register]);

  return (
    <div className="container h-100">
      <div className="h-100 row d-flex align-items-center">
        <div className="col-md-4 offset-md-4">
          <div className="card">
            <div className="card-body text-center">
              <img className="img-fluid my-3" src={logo} alt="carleton logo" style={{ height: 100 }}/>
              <h3 className="title">Please register</h3>
              <form role="form" className="register-form">
                <label className="sr-only" htmlFor="name">Name</label>
                <input
                  type="text"
                  className="form-control"
                  data-testid="name"
                  placeholder="Name"
                  name="name"
                  style={{
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                  }}
                  ref={register({ required: true })}
                />
                <label className="sr-only" htmlFor="email">Email</label>
                <input
                  type="text"
                  className="form-control"
                  data-testid="email"
                  placeholder="Email"
                  name="email"
                  style={{
                    borderRadius: 0,
                  }}
                  ref={register({ required: true })}
                />
                <label className="sr-only" htmlFor="birthDate">Birth date</label>
                <DatePicker
                  name="birthDate"
                  data-testid="birthDate"
                  className="form-control"
                  selected={birthDate}
                  onChange={handleChange}
                />
                <label className="sr-only" htmlFor="password">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  data-testid="password"
                  name="password"
                  style={{
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0,
                  }}
                  ref={register({ required: true })}
                />
                <button
                  type="button"
                  className="mt-4 btn btn-primary btn-block"
                  onClick={handleSubmit(onSubmit)}
                >
                  Register
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
