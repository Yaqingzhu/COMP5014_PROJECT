import * as React from 'react';
import { render, screen } from '@testing-library/react';

import { UserContext } from '../../context/userContext';
import { App } from '../App';

describe('App component', () => {
  const customRender = (ui, { providerProps, ...renderOptions }) => {
    return render(
      <UserContext.Provider {...providerProps}>{ui}</UserContext.Provider>,
      renderOptions
    );
  };

  it('Renders a Hello world when logged in', () => {
    const user = {
      username: 'test',
    };

    customRender(<App />, { providerProps: { value: { user } } });

    expect(screen.getByText(`Hello, ${user.username}!`)).toBeDefined();
  });

  it('Renders a Login page when not logged in', () => {
    render(<App />);

    expect(screen.getByRole('form')).toBeDefined();
  });
});
