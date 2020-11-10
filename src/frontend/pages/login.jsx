import React, { useState } from 'react';

import { useLogin } from '../api/useLogin';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { user, loading, error, login } = useLogin();

  const onSubmit = () => {
    login(username, password);
  };

  return (
    <form onSubmit={onSubmit}>
      {error && (
        <div className="error">
          {error}
        </div>
      )}
      {user && (
        <div className="success">
          {/* Remove when we redirect to another page */}
          Successfully logged-in!
        </div>
      )}
      <input
        type="text"
        value={username}
        placeholder="Email"
        onChange={event => setUsername(event.target.value)}
      />
      <input
        type="password"
        value={password}
        placeholder="Password"
        onChange={event => setPassword(event.target.value)}
      />
      <button
        type="submit"
        disabled={loading}
        className={loading ? 'loading' : ''}
      >
        Login
      </button>
    </form>
  );
};

export default Login;
