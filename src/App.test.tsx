import { render, screen } from '@testing-library/react';
import App from './App';

test('renders header', () => {
  render(<App />);
  const linkElement = screen.getByText(/Filter by search term/i);
  expect(linkElement).toBeInTheDocument();
});
