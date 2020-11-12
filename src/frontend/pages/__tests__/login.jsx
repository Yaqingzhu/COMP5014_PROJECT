import * as React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';

import { Login } from '../login';

describe('Login component', () => {
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
    const wrapper = render(<Login />);

    fireEvent.change(wrapper.getByPlaceholderText('Email'), { target: { value: username } });
    fireEvent.change(wrapper.getByPlaceholderText('Password'), { target: { value: password } });

    const submitButton = wrapper.getByText('Login');

    fireEvent.click(submitButton);

    expect(submitButton.classList).toContain('loading');

    await waitFor(() => screen.getByText('Successfully logged-in!'));

    expect(submitButton.classList).not.toContain('loading');
  });
});
