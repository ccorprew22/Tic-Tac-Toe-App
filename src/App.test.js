import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('Error after empty input appears', () => {
  const { getByLabelText } = render(<App />);
  const loginButtonElement = screen.getByText('Login');
  const input = getByLabelText("username");
  expect(input.value).toBe("");
  // expect(loginButtonElement).toBeInTheDocument();
  // fireEvent.change(input, { target: { value: "chris123" }});
  // expect(input.value).toBe("chris123");
  fireEvent.click(loginButtonElement);
  const error = screen.getByText('Input Box Cannot Be Empty');
  expect(error).toBeInTheDocument();
  
});

