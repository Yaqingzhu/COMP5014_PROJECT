import * as React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import { MemoryRouter as Router } from 'react-router-dom';
import fetchMock from 'jest-fetch-mock';

import { Register } from '../Register';

describe('Register component', () => {
  afterEach(() => {
    fetchMock.resetMocks();
  });

  it('Saves the value entered in fields', () => {
    const name = 'test';
    const email = 'test@test.test';
    const password = 'test';
    const wrapper = render(<Register />);

    const nameInput = wrapper.getByTestId('name');
    const emailInput = wrapper.getByTestId('email');
    const passwordInput = wrapper.getByTestId('password');

    fireEvent.change(nameInput, { target: { value: name } });
    fireEvent.change(emailInput, { target: { value: email } });
    fireEvent.change(passwordInput, { target: { value: password } });

    expect(nameInput.value).toBe(name);
    expect(emailInput.value).toBe(email);
    expect(passwordInput.value).toBe(password);
  });

  it('Logs the user into the application', async () => {
    const name = 'test';
    const email = 'test@test.test';
    const password = 'test';
    const wrapper = render(
      <Router>
        <Register />
      </Router>
    );

    fetchMock.mockOnce(JSON.stringify({
      responseCode: 0,
      success: true,
    }));

    fireEvent.change(wrapper.getByTestId('name'), { target: { value: name } });
    fireEvent.change(wrapper.getByTestId('email'), { target: { value: email } });
    fireEvent.change(wrapper.getByTestId('password'), { target: { value: password } });

    const submitButton = wrapper.getByText('Register');

    act(() => {
      fireEvent.click(submitButton);
    });
    await new Promise(resolve => setTimeout(resolve, 10));

    expect(fetchMock.mock.calls).toHaveLength(1);
    expect(fetchMock.mock.calls[0][1].body).toContain(name);
    expect(fetchMock.mock.calls[0][1].body).toContain(email);
    expect(fetchMock.mock.calls[0][1].body).toContain(password);
  });
});
