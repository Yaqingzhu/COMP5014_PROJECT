import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import logo from 'url:../assets/carleton.png';
import { useLogin } from '../api/useLogin';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { loading, error, login } = useLogin();

  const onSubmit = () => {
    login(username, password);
  };

  return (
    <div className="container h-100">
      <div className="h-100 row d-flex align-items-center">
        <div className="col-md-4 offset-md-4">
          <div className="card">
            <div className="card-body text-center">
              <img className="img-fluid my-3" src={logo} alt="carleton logo" style={{ height: 100 }}/>
              <h3 className="title">Please sign in</h3>
              <form role="form">
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                <label className="sr-only" htmlFor="email">Email</label>
                <input
                  type="text"
                  className="form-control"
                  value={username}
                  placeholder="Email"
                  name="email"
                  onChange={event => setUsername(event.target.value)}
                  required
                  style={{
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                  }}
                />
                <label className="sr-only" htmlFor="password">Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  placeholder="Password"
                  name="password"
                  onChange={event => setPassword(event.target.value)}
                  required
                  style={{
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0,
                  }}
                />
                <button
                  type="button"
                  disabled={loading}
                  className="mt-4 btn btn-primary btn-block"
                  onClick={onSubmit}
                >
                  {loading ? 'Loading...' : 'Login'}
                </button>
                <p className="mt-3">
                  <Link to="/register">
                    Register to the university
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
