import React, { useState } from 'react';

export const UserContext = React.createContext({
  user: null,
  setUser: null,
});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const WithUser = ({ children }) => (
  <UserContext.Consumer>
    {({ user, setUser }) => children({ user, setUser })}
  </UserContext.Consumer>
);
