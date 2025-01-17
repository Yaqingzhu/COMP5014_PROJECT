import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
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
      loginId: 1,
      loginName: 'test',
      role: 'admin',
    };

    customRender(<MemoryRouter><App /></MemoryRouter>, { providerProps: { value: { user } } });

    expect(screen.getByText('Hello, World!')).toBeDefined();
  });

  it('Renders a Login page when not logged in', () => {
    render(<MemoryRouter><App /></MemoryRouter>);

    expect(screen.getByRole('form')).toBeDefined();
  });
});
