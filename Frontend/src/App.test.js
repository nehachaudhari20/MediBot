import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Qubo chatbot', () => {
  render(<App />);
  const quboElement = screen.getByText(/Qubo/i);
  expect(quboElement).toBeInTheDocument();
});