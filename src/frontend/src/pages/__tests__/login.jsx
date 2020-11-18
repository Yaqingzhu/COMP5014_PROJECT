import * as React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';

import { UserProvider } from '../../context/userContext';
import { Login } from '../login';

describe('Login component', () => {
  afterEach(() => {
    fetchMock.resetMocks();
  });

  it('Saves the value entered in fields', () => {
    const username = 'test';
    const password = 'test';
    const wrapper = render(<Login />);

    const usernameInput = wrapper.getByPlaceholderText('Email');
    const passwordInput = wrapper.getByPlaceholderText('Password');

    fireEvent.change(usernameInput, { target: { value: username } });
    fireEvent.change(passwordInput, { target: { value: password } });

    expect(usernameInput.value).toBe(username);
    expect(passwordInput.value).toBe(password);
  });

  // TODO: Update when we use the API instead of a timeout
  it('Logs the user into the application', async () => {
    const username = 'test';
    const password = 'test';
    const wrapper = render(
      <UserProvider>
        <Login />
      </UserProvider>
    );

    fetchMock.mockOnce(JSON.stringify({
      loginStatus: 1,
      loginRole: 'admin',
    }));

    fireEvent.change(wrapper.getByPlaceholderText('Email'), { target: { value: username } });
    fireEvent.change(wrapper.getByPlaceholderText('Password'), { target: { value: password } });

    const submitButton = wrapper.getByText('Login');

    fireEvent.click(submitButton);

    expect(submitButton.getAttribute('disabled')).toBe('');

    await waitFor(() => screen.getByText('Login'));

    expect(submitButton.getAttribute('disabled')).toBe(null);
  });
});